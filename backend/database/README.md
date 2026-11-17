# Base de datos de Verdia

La base de datos se inicializa desde VS Code con tres piezas:

```text
 database/schema.sql
        ↓
 estructura base MySQL
        ↓
 Sequelize migrations
        ↓
 cambios controlados
        ↓
 database/seed.sql
        ↓
 datos iniciales no sensibles
```

## Primera instalación

1. Crear/arrancar MySQL.
2. Copiar `.env.example` a `.env`.
3. Configurar `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER` y `DB_PASSWORD`.
4. Ejecutar:

```bash
npm run db:setup
```

## Cambios posteriores

No editar tablas directamente en producción. Crear una nueva migration:

```bash
npx sequelize-cli migration:generate --name nombre-del-cambio
```

Luego:

```bash
npm run db:migrate
```

## Seed

`seed.sql` contiene solamente datos iniciales que no dependen de datos personales reales. No contiene contraseñas ni credenciales.

## Regla

No usar `sequelize.sync()` para construir el esquema de Verdia. El esquema se controla mediante `schema.sql` y migrations.
