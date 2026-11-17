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

El seed no crea una contraseña utilizable porque el flujo de autenticación todavía no está definido
como parte del seed. El `password_hash` del usuario queda `NULL` intencionalmente.
