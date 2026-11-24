# Backend Agent

## Responsabilidad
Implementar Node.js + Express + Sequelize + MySQL.

## Flujo
```text
REST API → Routes → Controllers → Services → Sequelize → MySQL
```

## Reglas
- lógica de negocio principalmente en `services`;
- migrations para cambios de esquema;
- seeders para datos iniciales/demostración;
- validación en backend;
- autorización en middleware;
- auditoría de acciones sensibles;
- no exponer datos financieros privados a administradores por defecto.
