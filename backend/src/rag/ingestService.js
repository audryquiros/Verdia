import crypto from 'node:crypto';
import { Op } from 'sequelize';
import { GoogleDriveSource } from './googleDrive.js';
import { chunkText, normalizeText } from './chunker.js';

function hashText(text) {
  return crypto.createHash('sha256').update(text, 'utf8').digest('hex');
}

function toDate(value) {
  return value ? new Date(value) : null;
}

function metadataFor(file) {
  return {
    driveFileId: file.id,
    driveName: file.name,
    driveMimeType: file.mimeType,
    driveModifiedTime: file.modifiedTime || null,
    driveWebViewLink: file.webViewLink || null,
  };
}

async function findDocument({ Documento, spaceId, externalId }) {
  return Documento.findOne({
    where: {
      espacio_financiero_id: spaceId,
      fuente_externa_id: externalId,
    },
  });
}

async function getLatestVersion({ DocumentoVersion, documentId }) {
  return DocumentoVersion.findOne({
    where: { documento_id: documentId },
    order: [['version', 'DESC']],
  });
}

async function createVersion({ DocumentoVersion, Fragmento, documentId, text, file, hash }) {
  const latest = await getLatestVersion({ DocumentoVersion, documentId });
  if (latest?.hash_contenido === hash) {
    return { changed: false, version: latest.version, fragmentCount: 0 };
  }

  const version = (latest?.version || 0) + 1;
  const chunks = chunkText(text);

  const createdVersion = await DocumentoVersion.create({
    documento_id: documentId,
    version,
    texto_extraido: text,
    hash_contenido: hash,
    ubicacion: file.webViewLink || null,
    tamano_bytes: file.size ? Number(file.size) : null,
  });

  if (chunks.length) {
    await Fragmento.bulkCreate(
      chunks.map((chunk) => ({
        documento_version_id: createdVersion.id,
        indice: chunk.index,
        contenido: chunk.content,
        metadata: {
          startOffset: chunk.startOffset,
          endOffset: chunk.endOffset,
          ...metadataFor(file),
        },
      }))
    );
  }

  return { changed: true, version, fragmentCount: chunks.length };
}

export async function syncGoogleDrive({
  db,
  spaceId,
  folderId,
  source = new GoogleDriveSource({ folderId }),
}) {
  if (!spaceId) throw new Error('spaceId is required');

  const files = await source.listAuthorizedFiles();
  const processed = [];
  const skipped = [];
  const errors = [];
  const seenExternalIds = new Set();

  for (const file of files) {
    seenExternalIds.add(file.id);

    try {
      const content = await source.getFileContent(file);
      const normalizedText = normalizeText(content.text);
      const hash = hashText(normalizedText);
      let document = await findDocument({
        Documento: db.Documento,
        spaceId,
        externalId: file.id,
      });

      if (!document) {
        document = await db.Documento.create({
          espacio_financiero_id: spaceId,
          fuente_externa_id: file.id,
          fuente_externa_modificada_at: toDate(file.modifiedTime),
          tipo: file.mimeType || 'DESCONOCIDO',
          origen: 'GOOGLE_DRIVE',
          nombre: file.name,
          ruta_url: file.webViewLink || null,
          mime_type: content.mimeType || file.mimeType || null,
          fecha_documento: toDate(file.modifiedTime),
          estado: 'ACTIVO',
        });
      } else {
        await document.update({
          fuente_externa_modificada_at: toDate(file.modifiedTime),
          nombre: file.name,
          ruta_url: file.webViewLink || document.ruta_url,
          mime_type: content.mimeType || file.mimeType || document.mime_type,
          estado: 'ACTIVO',
        });
      }

      const result = await createVersion({
        DocumentoVersion: db.DocumentoVersion,
        Fragmento: db.Fragmento,
        documentId: document.id,
        text: normalizedText,
        file,
        hash,
      });

      if (result.changed) {
        processed.push({
          id: document.id,
          driveFileId: file.id,
          name: file.name,
          version: result.version,
          fragmentCount: result.fragmentCount,
        });
      } else {
        skipped.push({
          id: document.id,
          driveFileId: file.id,
          name: file.name,
          reason: 'sin cambios',
        });
      }
    } catch (error) {
      errors.push({
        driveFileId: file.id,
        name: file.name,
        mimeType: file.mimeType,
        error: error.message,
      });
    }
  }

  if (seenExternalIds.size) {
    await db.Documento.update(
      { estado: 'INACTIVO' },
      {
        where: {
          espacio_financiero_id: spaceId,
          origen: 'GOOGLE_DRIVE',
          estado: 'ACTIVO',
          fuente_externa_id: { [Op.notIn]: [...seenExternalIds] },
        },
      }
    );
  }

  return {
    folderId: source.folderId,
    discovered: files.length,
    processed,
    skipped,
    errors,
  };
}
