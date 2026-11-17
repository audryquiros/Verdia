# Verdia — base del proyecto

Base inicial de Verdia para trabajar en VS Code, alineada con los mockups entregados y con la arquitectura acordada.

## Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- ORM: Sequelize
- Base de datos: MySQL
- RAG: Google Drive + Google Cloud
- Sin PostgreSQL, pgvector ni Docker

## Estructura

```text
verdia-base/
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── routes/
│       ├── services/
│       ├── context/
│       ├── hooks/
│       ├── utils/
│       ├── styles/
│       ├── app/
│       └── main/
├── backend/
│   ├── database/
│   │   ├── schema.sql
│   │   └── seed.sql
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       ├── services/
│       ├── migrations/
│       ├── middlewares/
│       ├── rag/
│       └── jobs/
└── docs/
```

## Base de datos

El flujo acordado es:

```text
schema.sql
    ↓
MySQL / estructura base
    ↓
Sequelize migrations
    ↓
cambios estructurales controlados
    ↓
seed.sql
    ↓
datos iniciales
```

Desde `backend/`:

```bash
npm install
cp .env.example .env
npm run db:setup
npm run dev
```

Cambios posteriores:

```bash
npm run db:migrate
npm run db:migrate:undo
npm run db:status
```

No se utiliza `sequelize.sync()` para construir el esquema.

## DER implementado

La base implementa las entidades definidas para el DER definitivo actual:

- usuarios
- sesiones
- espacios_financieros
- cuentas
- tarjetas
- categorias
- movimientos
- presupuestos
- deudas
- metas
- tipos_cambio
- conversaciones
- mensajes
- propuestas_vera
- fuentes_mensaje
- documentos
- documento_versiones
- fragmentos
- organizaciones
- roles
- membresias
- politicas
- politica_versiones
- auditoria
- eventos

Se mantienen fuera del esquema actual las entidades/funciones que fueron descartadas o quedaron pendientes, incluyendo `preferencias_usuario`, `integraciones`, `sincronizaciones`, `consentimientos`, `reservas`, `embeddings`, `planes`, `suscripciones`, `consumo` y un módulo independiente de monedas.

## RAG — Google Drive + Google Cloud

```text
Google Drive
    ↓
Ingesta documental
    ↓
MySQL: metadata / documentos / versiones / fragmentos
    ↓
Google Cloud: procesamiento + indexación + retrieval + IA
    ↓
Contexto + fuentes
    ↓
Vera
    ↓
Respuesta
```

Los servicios concretos de Google Cloud y el mecanismo exacto de embeddings/vector search se configuran en la implementación de infraestructura; no se fijan dentro del DER.

## Referencias visuales

Las imágenes entregadas para el diseño se conservan en `docs/`.
