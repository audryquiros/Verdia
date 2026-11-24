# TASK — Roles demo de administración

## Objetivo
Configurar los usuarios demo iniciales para probar el acceso administrativo.

## Scope
### Incluye
- agregar `usuarios.rol`;
- valores `USUARIO` y `ADMIN`;
- migración Sequelize;
- seed/demo data;
- middleware de administración;
- demo1 como `ADMIN`;
- demo2 como `USUARIO`;
- demás demos como `USUARIO`.

### No incluye
- nuevos roles de Policy Center;
- acceso irrestricto de ADMIN a finanzas;
- cambios de CRM;
- rediseño de Sidebar.

## SPEC relacionada
`.specify/specs/admin.md`

## Criterios de aceptación
- usuarios existentes reciben `USUARIO` por defecto;
- demo1 puede acceder a rutas ADMIN;
- demo2 no puede acceder a rutas ADMIN;
- un usuario no autenticado no puede acceder;
- el rol se valida en backend;
- la migración es reversible;
- los seeds son reproducibles.

## Verificación
- ejecutar migrations;
- ejecutar seed;
- probar login demo1;
- probar login demo2;
- probar una ruta admin;
- verificar respuesta 403 para demo2;
- ejecutar tests existentes.
