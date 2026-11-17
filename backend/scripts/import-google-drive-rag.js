import 'dotenv/config';
import { GoogleCloudRagProvider } from '../src/rag/googleCloud.js';

const folderId = process.env.GOOGLE_CLOUD_DRIVE_FOLDER_ID;
if (!folderId) throw new Error('Falta GOOGLE_CLOUD_DRIVE_FOLDER_ID en backend/.env');

const provider = new GoogleCloudRagProvider();
const operation = await provider.importDriveFolder({ folderId });

console.log('\nImportación enviada a Google Cloud RAG Engine.');
console.log(JSON.stringify(operation, null, 2));
console.log('\nCuando la operación termine, Vera podrá consultar el corpus desde /api/rag/query.');
