# Verdia — Base + Google Cloud RAG + mini chat

Esta versión mantiene la arquitectura aprobada de Verdia:

- React + Vite
- Node.js + Express
- Sequelize + MySQL
- Google Drive como origen documental
- Google Cloud RAG Engine para indexación/recuperación
- Gemini 3.5 Flash para generación
- Mini chat de Vera en una esquina para probar el RAG

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

## Configurar RAG

Lee primero:

```text
backend/src/rag/README.md
```

Flujo:

```text
Google Cloud project
→ APIs
→ autenticación
→ carpeta de Google Drive
→ corpus RAG
→ importación Drive
→ backend
→ mini chat de Vera
```

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

El backend nunca expone las credenciales de Google Cloud al frontend.
