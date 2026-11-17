import 'dotenv/config';
import { GoogleAuth } from 'google-auth-library';

const project = process.env.GOOGLE_CLOUD_PROJECT;
const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
const displayName = process.env.GOOGLE_CLOUD_RAG_CORPUS_NAME || 'Verdia RAG';

if (!project) throw new Error('Falta GOOGLE_CLOUD_PROJECT en backend/.env');

const auth = new GoogleAuth({ scopes: ['https://www.googleapis.com/auth/cloud-platform'] });
const client = await auth.getClient();
const { token } = await client.getAccessToken();
if (!token) throw new Error('No se pudo obtener el token de Google Cloud.');

const base = `https://${location}-aiplatform.googleapis.com/v1beta1/projects/${project}/locations/${location}`;
const headers = {
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
};

const response = await fetch(`${base}/ragCorpora`, {
  method: 'POST',
  headers,
  body: JSON.stringify({
    display_name: displayName,
    description: 'Corpus RAG de Verdia conectado a Google Drive.',
  }),
});

const data = await response.json();
if (!response.ok) {
  throw new Error(data?.error?.message || JSON.stringify(data));
}

let corpusName = data?.response?.name;

if (!corpusName && data?.name) {
  console.log('Creación del corpus iniciada. Esperando a Google Cloud…');

  for (let attempt = 1; attempt <= 30; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const operationResponse = await fetch(
      `https://${location}-aiplatform.googleapis.com/v1beta1/${data.name}`,
      { headers },
    );
    const operation = await operationResponse.json();

    if (!operationResponse.ok) {
      throw new Error(operation?.error?.message || JSON.stringify(operation));
    }

    if (operation.done) {
      if (operation.error) {
        throw new Error(operation.error.message || JSON.stringify(operation.error));
      }
      corpusName = operation.response?.name;
      break;
    }

    process.stdout.write(`\rEsperando… ${attempt}/30`);
  }
  process.stdout.write('\n');
}

if (!corpusName) {
  throw new Error('Google Cloud no devolvió todavía el nombre del corpus. Revisa la operación en la consola e inténtalo de nuevo.');
}

console.log('\nCorpus RAG creado correctamente.');
console.log(`GOOGLE_CLOUD_RAG_CORPUS=${corpusName}`);
console.log('\nCopia esa línea en backend/.env y luego ejecuta:');
console.log('npm run rag:import-drive');
