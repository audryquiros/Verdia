# Design — Seguridad y privacidad

## Principios
- minimización de datos;
- mínimo privilegio;
- permisos explícitos;
- trazabilidad de acciones sensibles;
- eliminación real de cuenta;
- cifrado en tránsito y reposo;
- backups protegidos;
- logs sin información personal innecesaria.

## Vera
Las propuestas se escriben en una estructura de propuestas/borradores.
La confirmación ocurre mediante una operación separada autorizada por la sesión del usuario.

Contenido externo como correos, PDF, imágenes y facturas se considera no confiable hasta validarlo.

## Administración
Roles principales:
- `USUARIO`
- `ADMIN`

`ADMIN` no significa acceso irrestricto a información financiera.

Las acciones administrativas sensibles deben quedar auditadas.
