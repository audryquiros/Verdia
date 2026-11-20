import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { extractText } from '../rag/textExtractor.js';
import { chunkText, normalizeText } from '../rag/chunker.js';
import { retrieveFragments } from '../rag/retriever.js';
import { getAdminDashboard, getRagOverview, listUsers, listKnowledge, listSupportCases, getSupportCase, addSupportMessage, updateSupportCase, createSupportCase } from '../services/admin/admin.service.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STORAGE_DIR = path.resolve(__dirname, '../../storage/rag');
const ALLOWED_MIME = new Set(['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'text/markdown', 'application/json']);
const MAX_BYTES = 10 * 1024 * 1024;

async function audit(req, action, entity, entityId, detail = {}) {
  await req.app.locals.db.Auditoria.create({ usuario_id: req.auth.user.id, accion: action, entidad: entity, entidad_id: entityId || null, detalle: detail, ip: req.ip, resultado: 'OK' });
}

export async function dashboard(req, res, next) { try { res.json(await getAdminDashboard(req.app.locals.db)); } catch (e) { next(e); } }
export async function ragOverview(req, res, next) { try { res.json(await getRagOverview(req.app.locals.db)); } catch (e) { next(e); } }
export async function ragQuery(req, res, next) {
  try {
    const query = String(req.body?.query || '').trim();
    if (!query) return res.status(400).json({ message: 'Consulta requerida.' });
    const results = await retrieveFragments({ Fragmento: req.app.locals.db.Fragmento, query, limit: req.body?.limit, globalOnly: true });
    res.json({ query, retrievedCount: results.length, sources: results.map(({ id, title, uri, content, score }) => ({ id, title, uri, content, score: score == null ? null : Number(score) })) });
  } catch (e) { next(e); }
}
export async function users(req, res, next) { try { res.json(await listUsers(req.app.locals.db, req.query)); } catch (e) { next(e); } }

export async function knowledge(req, res, next) { try { res.json({ documents: await listKnowledge(req.app.locals.db) }); } catch (e) { next(e); } }

export async function uploadKnowledge(req, res, next) {
  try {
    const { fileName, mimeType, base64, title, description } = req.body || {};
    if (!fileName || !base64) return res.status(400).json({ message: 'Archivo requerido.' });
    if (!ALLOWED_MIME.has(mimeType) && !/\.(pdf|docx|txt|md|json)$/i.test(fileName)) return res.status(400).json({ message: 'Tipo de archivo no permitido.' });
    const buffer = Buffer.from(base64, 'base64');
    if (!buffer.length || buffer.length > MAX_BYTES) return res.status(400).json({ message: 'El archivo debe pesar como máximo 10 MB.' });
    const text = normalizeText(await extractText({ buffer, mimeType, fileName }));
    if (!text.trim()) return res.status(400).json({ message: 'No se pudo extraer texto del archivo.' });
    const hash = crypto.createHash('sha256').update(text, 'utf8').digest('hex');
    const db = req.app.locals.db;
    const safeTitle = String(title || fileName).trim().slice(0, 255);
    const document = await db.Documento.create({ usuario_id: null, espacio_financiero_id: null, tipo: mimeType || path.extname(fileName).slice(1).toUpperCase(), origen: 'CRM_ADMIN', nombre: safeTitle, descripcion: String(description || '').trim().slice(0, 500) || null, mime_type: mimeType || null, estado: 'BORRADOR', subido_por_usuario_id: req.auth.user.id });
    const version = await db.DocumentoVersion.create({ documento_id: document.id, version: 1, texto_extraido: text, hash_contenido: hash, tamano_bytes: buffer.length, ubicacion: null });
    const chunks = chunkText(text);
    if (chunks.length) await db.Fragmento.bulkCreate(chunks.map((chunk) => ({ documento_version_id: version.id, indice: chunk.index, contenido: chunk.content, metadata: { source: 'CRM_ADMIN', fileName } })));
    const storedName = `${document.id}-${hash.slice(0, 16)}${path.extname(fileName).toLowerCase()}`;
    await fs.mkdir(STORAGE_DIR, { recursive: true });
    await fs.writeFile(path.join(STORAGE_DIR, storedName), buffer);
    await document.update({ ruta_url: `storage/rag/${storedName}` });
    await audit(req, 'ADMIN_RAG_DOCUMENT_UPLOADED', 'documentos', document.id, { name: safeTitle, version: 1, fragmentCount: chunks.length });
    res.status(201).json({ document, version: { id: version.id, version: 1, fragmentCount: chunks.length } });
  } catch (e) { next(e); }
}

export async function publishKnowledge(req, res, next) {
  try {
    const db = req.app.locals.db;
    const document = await db.Documento.findOne({ where: { id: req.params.id, origen: 'CRM_ADMIN' } });
    if (!document) return res.status(404).json({ message: 'Documento no encontrado.' });
    await document.update({ estado: 'PUBLICADO', publicado_at: new Date() });
    await audit(req, 'ADMIN_RAG_DOCUMENT_PUBLISHED', 'documentos', document.id);
    res.json({ document });
  } catch (e) { next(e); }
}

export async function unpublishKnowledge(req, res, next) {
  try {
    const db = req.app.locals.db;
    const document = await db.Documento.findOne({ where: { id: req.params.id, origen: 'CRM_ADMIN' } });
    if (!document) return res.status(404).json({ message: 'Documento no encontrado.' });
    await document.update({ estado: 'INACTIVO' });
    await audit(req, 'ADMIN_RAG_DOCUMENT_UNPUBLISHED', 'documentos', document.id);
    res.json({ document });
  } catch (e) { next(e); }
}

export async function supportCases(req, res, next) { try { res.json({ cases: await listSupportCases(req.app.locals.db, req.query) }); } catch (e) { next(e); } }
export async function supportCase(req, res, next) { try { const item = await getSupportCase(req.app.locals.db, req.params.id); if (!item) return res.status(404).json({ message: 'Caso no encontrado.' }); res.json({ case: item }); } catch (e) { next(e); } }
export async function supportReply(req, res, next) { try { const content = String(req.body?.content || '').trim(); if (!content) return res.status(400).json({ message: 'Mensaje requerido.' }); const item = await addSupportMessage(req.app.locals.db, { caseId: req.params.id, authorId: req.auth.user.id, authorType: 'ADMIN', content }); await audit(req, 'ADMIN_SUPPORT_MESSAGE_SENT', 'casos_soporte', item.id); res.json({ case: item }); } catch (e) { next(e); } }
export async function supportUpdate(req, res, next) { try { const item = await updateSupportCase(req.app.locals.db, { id: req.params.id, status: req.body?.status, priority: req.body?.priority, adminId: req.auth.user.id }); await audit(req, 'ADMIN_SUPPORT_CASE_UPDATED', 'casos_soporte', item.id, { status: req.body?.status, priority: req.body?.priority }); res.json({ case: item }); } catch (e) { next(e); } }

export async function createSupport(req, res, next) {
  try {
    const asunto = String(req.body?.asunto || '').trim();
    const mensaje = String(req.body?.mensaje || '').trim();
    if (!asunto || !mensaje) return res.status(400).json({ message: 'Asunto y mensaje son obligatorios.' });
    const item = await createSupportCase(req.app.locals.db, { userId: req.auth.user.id, asunto, mensaje, origen: req.body?.origen === 'VERA' ? 'VERA' : 'USUARIO' });
    await audit(req, 'SUPPORT_CASE_CREATED', 'casos_soporte', item.id, { origen: item.origen });
    res.status(201).json({ case: item });
  } catch (e) { next(e); }
}

export async function mySupport(req, res, next) { try { const items = await req.app.locals.db.CasoSoporte.findAll({ where: { usuario_id: req.auth.user.id }, order: [['updated_at', 'DESC']] }); res.json({ cases: items }); } catch (e) { next(e); } }
export async function mySupportCase(req, res, next) { try { const item = await getSupportCase(req.app.locals.db, req.params.id); if (!item || Number(item.usuario_id) !== Number(req.auth.user.id)) return res.status(404).json({ message: 'Caso no encontrado.' }); res.json({ case: item }); } catch (e) { next(e); } }
export async function mySupportReply(req, res, next) { try { const item = await getSupportCase(req.app.locals.db, req.params.id); if (!item || Number(item.usuario_id) !== Number(req.auth.user.id)) return res.status(404).json({ message: 'Caso no encontrado.' }); const content = String(req.body?.content || '').trim(); if (!content) return res.status(400).json({ message: 'Mensaje requerido.' }); await addSupportMessage(req.app.locals.db, { caseId: item.id, authorId: req.auth.user.id, authorType: 'USUARIO', content }); res.json({ ok: true }); } catch (e) { next(e); } }
