# Design — Arquitectura

## Frontend
React + Vite.

## Backend
Node.js + Express + Sequelize + MySQL + Sequelize CLI.

## Separación
Frontend → REST API → Routes → Controllers → Services → Sequelize → MySQL.

La lógica de negocio debe permanecer principalmente en services.

## Dominios
Las finanzas personales, Vera, documentos/RAG y Policy Center son módulos/capacidades separados.

El espacio financiero pertenece al usuario y no depende de `empresa_id`.

## Datos administrativos
El análisis administrativo debe utilizar datos operativos y agregados siempre que sea suficiente.

No copiar el contenido financiero completo a un CRM.
