import { GoogleDriveSource } from '../src/rag/googleDrive.js';
import { env } from '../src/config/env.js';

const folderId = process.argv[2] || env.GOOGLE_DRIVE_FOLDER_ID;
if (!folderId) {
  console.error('Falta GOOGLE_DRIVE_FOLDER_ID o el primer argumento folderId');
  process.exit(1);
}

try {
  const source = new GoogleDriveSource({ folderId });
  const files = await source.listAuthorizedFiles();

  console.log(`Google Drive conectado correctamente.`);
  console.log(`Carpeta: ${folderId}`);
  console.log(`Archivos encontrados: ${files.length}`);

  for (const file of files.slice(0, 20)) {
    console.log(`- ${file.name} | ${file.mimeType} | ${file.id}`);
  }

  if (files.length > 20) {
    console.log(`... y ${files.length - 20} archivo(s) más.`);
  }
} catch (error) {
  console.error(`No se pudo conectar con Google Drive: ${error.message}`);
  process.exitCode = 1;
}
