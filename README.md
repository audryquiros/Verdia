# Verdia — Base + RAG documental + mini chat

Esta versión mantiene la arquitectura de Verdia:

- React + Vite
- Node.js + Express
- Sequelize + MySQL
- Google Drive como origen documental
- MySQL para documentos, versiones y fragmentos
- MySQL Full-Text Search para recuperación documental
- Mini chat de Vera para probar la recuperación

## Arranque rápido

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## RAG

Lee primero:

```text
backend/src/rag/README.md
```

Flujo:

```text
Google Drive
→ extracción
→ documentos y versiones
→ fragmentos
→ MySQL Full-Text Search
→ contexto recuperado
→ mini chat de Vera
```

El módulo RAG ya no depende de servicios externos de generación administrados.

## Mini chat

El componente está en:

```text
frontend/src/components/RagChatWidget/
```

y se monta globalmente desde:

```text
frontend/src/app/App.jsx
```

Endpoint:

```text
POST /api/rag/query
```

El backend nunca expone las credenciales de Google Drive al frontend.
