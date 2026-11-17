import 'dotenv/config';
import { GoogleAuth } from 'google-auth-library';

const required = [
  'GOOGLE_CLOUD_PROJECT',
  'GOOGLE_CLOUD_RAG_CORPUS',
  'GOOGLE_CLOUD_DRIVE_FOLDER_ID',
];

const missing = required.filter((name) => !process.env[name]);
if (missing.length) {
  console.error(`Faltan variables: ${missing.join(', ')}`);
  process.exit(1);
}

const auth = new GoogleAuth({ scopes: ['https://www.googleapis.com/auth/cloud-platform'] });
const client = await auth.getClient();
const { token } = await client.getAccessToken();

if (!token) {
  console.error('No se pudo obtener un token de Google Cloud.');
  process.exit(1);
}

console.log('✓ Variables de RAG configuradas.');
console.log('✓ Credenciales de Google Cloud disponibles.');
console.log(`✓ Proyecto: ${process.env.GOOGLE_CLOUD_PROJECT}`);
console.log(`✓ Región: ${process.env.GOOGLE_CLOUD_LOCATION || 'us-central1'}`);
console.log('✓ Carpeta de Drive configurada.');
console.log('✓ Corpus RAG configurado.');
