# Database

## Setup

```bash
npm run db:setup
```

## Development data

Para poblar una base local con datos coherentes de prueba de los principales dominios de Verdia:

```bash
npm run db:seed
```

El seed crea datos para usuarios, sesiones, espacios financieros, cuentas, tarjetas,
categorías, tipos de cambio, deudas, metas, movimientos, presupuestos, conversaciones de Vera,
mensajes, fuentes, propuestas, documentos/RAG, organizaciones, roles, membresías, políticas,
versiones de políticas, auditoría y eventos.

Los registros del seed usan IDs `900001+` y correos `@verdia.test`, y se eliminan/recrean solo esos
registros al volver a ejecutar el seed. **No ejecutar en producción.**

El usuario principal de prueba es:

- Email: `demo@verdia.test`
- Usuario ID: `900001`
- Espacio financiero ID: `900001`

Los usuarios demo tienen una contraseña de desarrollo utilizable:

- `demo@verdia.test` / `Demo1234!`
- `demo2@verdia.test` / `Demo1234!`

La contraseña nunca se guarda en texto plano; el seed almacena únicamente un hash scrypt.
