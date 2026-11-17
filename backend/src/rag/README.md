# Verdia RAG — Google Drive + Google Cloud RAG Engine

Esta implementación usa **Google Drive como origen documental** y **Google Cloud RAG Engine + Gemini** para indexación, recuperación y generación. MySQL continúa siendo la base de datos de Verdia; el índice/vectorización del RAG permanece en Google Cloud.

## Flujo

```text
Google Drive
    ↓
Google Cloud RAG Engine
    ├── importación
    ├── chunking
    ├── embeddings / índice administrado
    └── retrieval
            ↓
      contexto recuperado
            ↓
       Gemini 3.5 Flash
            ↓
           Vera
            ↓
      respuesta + fuentes
```

## 1. Google Cloud

Entra a Google Cloud Console y crea o selecciona el proyecto de desarrollo de Verdia.

Habilita como mínimo:

- Vertex AI / Agent Platform API
- Google Drive API

La documentación actual de Google confirma que RAG Engine puede importar directamente una carpeta de Google Drive y que la importación es asíncrona. También recomienda que la identidad que ejecuta la importación tenga permisos sobre la carpeta. urlDocumentación oficial: RAG Engine e ingestión desde Google Drivehttps://docs.cloud.google.com/gemini-enterprise-agent-platform/build/rag-engine/use-data-ingestion

## 2. Autenticación local

Para probar desde tu PC puedes usar Application Default Credentials:

```bash
gcloud auth application-default login
```

También puedes usar una cuenta de servicio. En ese caso, comparte la carpeta de Google Drive con el correo de la cuenta de servicio con permiso de lector y configura `GOOGLE_APPLICATION_CREDENTIALS` apuntando a la credencial **fuera del repositorio**.

No subas JSON de credenciales a Git.

## 3. Configurar `backend/.env`

Copia:

```text
backend/.env.example
```

como:

```text
backend/.env
```

Y completa:

```env
GOOGLE_CLOUD_PROJECT=tu-project-id
GOOGLE_CLOUD_LOCATION=us-central1
GOOGLE_CLOUD_RAG_CORPUS=
GOOGLE_CLOUD_DRIVE_FOLDER_ID=tu-folder-id
GOOGLE_CLOUD_GEMINI_MODEL=gemini-3.5-flash
```

Google documenta actualmente `gemini-3.5-flash` como modelo GA y muestra ejemplos de generación con ese modelo. urlDocumentación oficial: Gemini 3.5 Flashhttps://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-5-flash

## 4. Crear el corpus

Desde:

```bash
cd backend
npm install
```

ejecuta:

```bash
npm run rag:create-corpus
```

El script devolverá algo parecido a:

```env
GOOGLE_CLOUD_RAG_CORPUS=projects/123456/locations/us-central1/ragCorpora/789012
```

Copia esa línea en `backend/.env`.

## 5. Importar Google Drive

Pon en `.env` el ID de la carpeta de Drive:

```env
GOOGLE_CLOUD_DRIVE_FOLDER_ID=...
```

Después:

```bash
npm run rag:import-drive
```

La operación de importación es asíncrona. Espera a que Google Cloud termine de procesar los archivos antes de probar el chat. Google RAG Engine usa el contenido de Drive para crear los fragmentos y el índice de recuperación. urlDocumentación oficial: importar archivos de Google Drivehttps://docs.cloud.google.com/gemini-enterprise-agent-platform/reference/models/rag-api

## 6. Levantar Verdia

Backend:

```bash
cd backend
npm run dev
```

Frontend, en otra terminal:

```bash
cd frontend
npm install
npm run dev
```

Abre:

```text
http://localhost:5173
```

En la esquina inferior derecha aparecerá **Probar Vera**.

## 7. Probar el RAG

Haz preguntas que estén respondidas explícitamente en los documentos de la carpeta.

Ejemplo:

```text
¿Qué dice el documento sobre el objetivo de Verdia?
```

La respuesta debe mostrar:

- respuesta de Vera;
- documentos recuperados como fuentes;
- error claro si Google Cloud no está configurado;
- ausencia de invención cuando el contexto no contiene la respuesta.

## Importante para Verdia

Este chat es **solo un arnés de prueba del RAG**. No debe tener acceso a operaciones financieras ni confirmar movimientos. Vera mantiene la regla del proyecto: **propone; el usuario confirma**.

Los documentos recuperados se tratan como datos, no como instrucciones. Esto evita que un texto dentro de un PDF o documento pueda convertirse en una orden para Vera.
