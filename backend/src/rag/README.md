# Verdia RAG — Google Drive + MySQL

La fuente documental del RAG de Verdia es Google Drive.

## Flujo

```text
Google Drive
    ↓
Google Drive API
    ↓
GoogleDriveSource
    ↓
extracción de texto
    ↓
chunker
    ↓
Documento / DocumentoVersion
    ↓
Fragmento
    ↓
MySQL Full-Text Search
    ↓
contextBuilder
    ↓
Vera / proveedor LLM
```

## Google Drive

El backend utiliza una cuenta de servicio y el scope:

```text
https://www.googleapis.com/auth/drive.readonly
```

La carpeta debe estar compartida con el correo de la cuenta de servicio como lector.

Variables:

```env
GOOGLE_DRIVE_FOLDER_ID=id-de-la-carpeta
GOOGLE_APPLICATION_CREDENTIALS=./credenciales/cuenta-servicio.json
```

## Probar solo Drive

```bash
npm run rag:test-drive
```

También se puede pasar el ID directamente:

```bash
npm run rag:test-drive -- ID_DE_LA_CARPETA
```

## Sincronizar Drive → MySQL

```bash
npm run rag:sync-drive
```

o:

```bash
npm run rag:sync-drive -- 1 ID_DE_LA_CARPETA
```

La sincronización:

1. lista la carpeta y sus subcarpetas;
2. identifica archivos por su ID de Drive;
3. descarga el contenido;
4. calcula SHA-256;
5. crea una nueva `documento_version` solamente si cambió;
6. fragmenta el texto;
7. guarda los fragmentos en MySQL;
8. marca como inactivos los documentos de Drive que ya no aparecen en la carpeta.

## Tipos soportados actualmente

- Google Docs → exportación a texto.
- Google Sheets → exportación a CSV.
- Google Slides → exportación a texto.
- archivos `text/*` y JSON/XML/JavaScript.
- PDF y DOCX requieren un extractor de texto disponible en el entorno de ejecución.

La recuperación utiliza MySQL Full-Text Search. La arquitectura no depende de servicios vectoriales administrados ni de PostgreSQL.
