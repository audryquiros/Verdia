# Migraciones de Verdia

## Flujo acordado

1. `database/schema.sql` crea la estructura base de MySQL.
2. `database/seed.sql` carga datos iniciales no sensibles.
3. Sequelize CLI gestiona cambios posteriores mediante `src/migrations/`.
4. `npm run db:setup` ejecuta los tres pasos en orden.

No se debe usar `sequelize.sync()` para crear la estructura de producción. La estructura se controla con SQL + migrations.

## Comandos

```bash
npm run db:setup
npm run db:migrate
npm run db:migrate:undo
npm run db:status
```

La migración `202611170001-baseline-indexes` representa el primer cambio controlado sobre el esquema base: índices necesarios para consultas financieras y documentales.
