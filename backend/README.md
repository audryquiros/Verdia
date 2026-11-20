# Verdia Backend

Node.js + Express + Sequelize + MySQL.

## Base de datos

La BD se administra desde VS Code mediante:

- `database/schema.sql`: estructura inicial.
- `database/seed.sql`: datos iniciales no sensibles.
- `src/migrations/`: cambios estructurales posteriores.
- `src/models/`: modelos Sequelize.

### Primera instalación

```bash
npm install
cp .env.example .env
npm run db:setup
npm run dev
```

### Migraciones

```bash
npm run db:migrate
npm run db:migrate:undo
npm run db:status
```

No usar `sequelize.sync()`.

## RAG

El RAG pertenece a Verdia y utiliza Google Drive como origen documental y Google Cloud como infraestructura RAG. MySQL conserva metadata y entidades de aplicación/documentos.

## CRM administrativo

El CRM se habilita para usuarios con `usuarios.rol = 'ADMIN'`. El usuario de desarrollo `demo1@verdia.test` queda como ADMIN y `demo2@verdia.test` como USUARIO.

Incluye:
- Dashboard administrativo y directorio mínimo de usuarios.
- Base de conocimiento RAG con carga directa desde el CRM.
- Publicación/despublicación de documentos RAG.
- Bandeja de soporte y respuestas del administrador.
- Soporte para el usuario final.
- Auditoría de acciones administrativas.

Los documentos cargados desde CRM usan `origen='CRM_ADMIN'`, quedan asociados globalmente (sin espacio financiero) y solo entran al RAG cuando están `PUBLICADO`.
