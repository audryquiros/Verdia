SET NAMES utf8mb4;
USE `verdia`;

-- VERDIA DEVELOPMENT SEED
-- Purpose: populate a complete, coherent dataset for local development/testing.
-- This seed is intentionally isolated under IDs 900001+ and emails @verdia.test.
-- It is safe to run repeatedly: rows with these IDs are updated/replaced.
-- Do NOT use this seed in production.

SET FOREIGN_KEY_CHECKS = 0;

-- Remove only the records owned by this development seed.
DELETE FROM `fuentes_mensaje` WHERE `id` BETWEEN 900001 AND 900010;
DELETE FROM `propuestas_vera` WHERE `id` BETWEEN 900001 AND 900010;
DELETE FROM `mensajes` WHERE `id` BETWEEN 900001 AND 900020;
DELETE FROM `conversaciones` WHERE `id` BETWEEN 900001 AND 900010;
DELETE FROM `fragmentos` WHERE `id` BETWEEN 900001 AND 900050;
DELETE FROM `documento_versiones` WHERE `id` BETWEEN 900001 AND 900020;
DELETE FROM `documentos` WHERE `id` BETWEEN 900001 AND 900010;
DELETE FROM `movimientos` WHERE `id` BETWEEN 900001 AND 900030;
DELETE FROM `presupuestos` WHERE `id` BETWEEN 900001 AND 900020;
DELETE FROM `metas` WHERE `id` BETWEEN 900001 AND 900020;
DELETE FROM `deudas` WHERE `id` BETWEEN 900001 AND 900020;
DELETE FROM `tarjetas` WHERE `id` BETWEEN 900001 AND 900020;
DELETE FROM `cuentas` WHERE `id` BETWEEN 900001 AND 900020;
DELETE FROM `categorias` WHERE `id` BETWEEN 900001 AND 900050;
DELETE FROM `tipos_cambio` WHERE `id` BETWEEN 900001 AND 900020;
DELETE FROM `sesiones` WHERE `id` BETWEEN 900001 AND 900010;
DELETE FROM `auditoria` WHERE `id` BETWEEN 900001 AND 900020;
DELETE FROM `eventos` WHERE `id` BETWEEN 900001 AND 900020;
DELETE FROM `politica_versiones` WHERE `id` BETWEEN 900001 AND 900020;
DELETE FROM `politicas` WHERE `id` BETWEEN 900001 AND 900020;
DELETE FROM `membresias` WHERE `id` BETWEEN 900001 AND 900020;
DELETE FROM `roles` WHERE `id` BETWEEN 900001 AND 900020;
DELETE FROM `organizaciones` WHERE `id` BETWEEN 900001 AND 900020;
DELETE FROM `espacios_financieros` WHERE `id` BETWEEN 900001 AND 900010;
DELETE FROM `mensajes_soporte` WHERE `id` BETWEEN 900001 AND 900020;
DELETE FROM `casos_soporte` WHERE `id` BETWEEN 900001 AND 900020;
DELETE FROM `usuarios` WHERE `id` BETWEEN 900001 AND 900010;

-- Users
INSERT INTO `usuarios` (`id`,`email`,`password_hash`,`nombre`,`apellido`,`foto_url`,`estado`,`rol`,`email_verificado_at`)
VALUES
(900001,'demo1@verdia.test','scrypt$16384$8$1$0GJVTeMTrxAnIfjuNtRjpQ$Bqj1vw3jcYb00AdUs4yyWgs7VocGdwWoJoG0tci1hest-yZli6QYopdnRed73HOG_Ie-vD9c8BsRxQWQXtTpdQ','Ana','Solís',NULL,'ACTIVO','ADMIN','2026-11-01 09:00:00'),
(900002,'demo2@verdia.test','scrypt$16384$8$1$0GJVTeMTrxAnIfjuNtRjpQ$Bqj1vw3jcYb00AdUs4yyWgs7VocGdwWoJoG0tci1hest-yZli6QYopdnRed73HOG_Ie-vD9c8BsRxQWQXtTpdQ','Luis','Mora',NULL,'ACTIVO','USUARIO','2026-11-01 09:05:00');

-- Sessions: token_hash is a development placeholder, not a real credential.
INSERT INTO `sesiones` (`id`,`usuario_id`,`token_hash`,`ip`,`user_agent`,`expira_at`,`revocada_at`)
VALUES
(900001,900001,'seed-token-hash-demo-001','127.0.0.1','Verdia Development Seed','2026-12-31 23:59:59',NULL),
(900002,900002,'seed-token-hash-demo-002','127.0.0.1','Verdia Development Seed','2026-12-31 23:59:59',NULL);

-- Financial spaces
INSERT INTO `espacios_financieros` (`id`,`usuario_id`,`nombre`,`tipo`,`moneda_principal`,`saldo_inicial`,`saldo_inicial_fecha`,`activo`)
VALUES
(900001,900001,'Finanzas personales','PERSONAL','CRC',250000.0000,'2026-11-01',TRUE),
(900002,900002,'Finanzas personales','PERSONAL','CRC',180000.0000,'2026-11-01',TRUE);

-- Accounts
INSERT INTO `cuentas` (`id`,`espacio_financiero_id`,`nombre`,`tipo`,`institucion`,`moneda`,`saldo_inicial`,`activa`)
VALUES
(900001,900001,'Cuenta principal','BANCO','Banco Demo','CRC',200000.0000,TRUE),
(900002,900001,'Efectivo','EFECTIVO',NULL,'CRC',50000.0000,TRUE),
(900003,900001,'Ahorros','AHORRO','Banco Demo','USD',100.0000,TRUE),
(900004,900002,'Cuenta principal','BANCO','Banco Demo','CRC',150000.0000,TRUE),
(900005,900002,'Efectivo','EFECTIVO',NULL,'CRC',30000.0000,TRUE);

-- Cards
INSERT INTO `tarjetas` (`id`,`espacio_financiero_id`,`cuenta_id`,`alias`,`tipo`,`ultimos_4`,`fecha_corte`,`fecha_vencimiento_pago`,`fecha_vencimiento_minimo`,`tasa_interes_actual`,`tasa_penalizacion`,`limite_credito`,`activa`)
VALUES
(900001,900001,900001,'Visa principal','CREDITO','1234',15,5,25,29.9000,39.9000,1000000.0000,TRUE),
(900002,900001,900001,'Débito principal','DEBITO','5678',NULL,NULL,NULL,NULL,NULL,NULL,TRUE),
(900003,900002,900004,'Visa demo','CREDITO','9012',20,10,28,28.5000,38.0000,500000.0000,TRUE);

-- System + user categories
INSERT INTO `categorias` (`id`,`espacio_financiero_id`,`nombre`,`tipo`,`categoria_padre_id`,`sistema`,`color`,`icono`,`activa`)
VALUES
(900001,900001,'Salario','INGRESO',NULL,TRUE,NULL,'briefcase',TRUE),
(900002,900001,'Otros ingresos','INGRESO',NULL,TRUE,NULL,'plus',TRUE),
(900003,900001,'Alimentación','GASTO',NULL,TRUE,NULL,'utensils',TRUE),
(900004,900001,'Vivienda','GASTO',NULL,TRUE,NULL,'home',TRUE),
(900005,900001,'Transporte','GASTO',NULL,TRUE,NULL,'car',TRUE),
(900006,900001,'Servicios','GASTO',NULL,TRUE,NULL,'bolt',TRUE),
(900007,900001,'Salud','GASTO',NULL,TRUE,NULL,'heart',TRUE),
(900008,900001,'Entretenimiento','GASTO',NULL,TRUE,NULL,'film',TRUE),
(900009,900001,'Restaurantes','GASTO',900003,FALSE,NULL,'restaurant',TRUE),
(900010,900001,'Freelance','INGRESO',NULL,FALSE,NULL,'laptop',TRUE),
(900011,900002,'Salario','INGRESO',NULL,TRUE,NULL,'briefcase',TRUE),
(900012,900002,'Alimentación','GASTO',NULL,TRUE,NULL,'utensils',TRUE),
(900013,900002,'Transporte','GASTO',NULL,TRUE,NULL,'car',TRUE);

-- Exchange-rate snapshots
INSERT INTO `tipos_cambio` (`id`,`moneda_origen`,`moneda_destino`,`tasa`,`fuente`,`fecha_tasa`)
VALUES
(900001,'USD','CRC',510.25000000,'SEED','2026-11-01'),
(900002,'USD','CRC',511.10000000,'SEED','2026-11-15'),
(900003,'CRC','USD',0.00195600,'SEED','2026-11-15');

-- Debts
INSERT INTO `deudas` (`id`,`espacio_financiero_id`,`tipo`,`nombre`,`tercero_alias`,`monto_original`,`moneda`,`saldo_actual`,`fecha_inicio`,`fecha_vencimiento`,`tasa_interes`,`estado`)
VALUES
(900001,900001,'POR_PAGAR','Préstamo personal','Persona A',120000.0000,'CRC',80000.0000,'2026-10-01','2026-12-15',0.0000,'ACTIVA'),
(900002,900001,'POR_COBRAR','Dinero prestado','Persona B',50000.0000,'CRC',30000.0000,'2026-10-15','2026-11-30',0.0000,'ACTIVA'),
(900003,900002,'POR_PAGAR','Compra a crédito','Persona C',45000.0000,'CRC',45000.0000,'2026-11-01','2026-12-01',0.0000,'ACTIVA');

-- Goals
INSERT INTO `metas` (`id`,`espacio_financiero_id`,`nombre`,`descripcion`,`monto_objetivo`,`monto_actual`,`moneda`,`fecha_objetivo`,`estado`,`institucion`,`tipo_cuenta`,`saldo_actual`,`tasa_interes`,`beneficio_estimado`)
VALUES
(900001,900001,'Fondo de emergencia','Meta de ahorro para imprevistos.',600000.0000,180000.0000,'CRC','2027-06-30','ACTIVA','Banco Demo','Ahorro',180000.0000,3.5000,0.0000),
(900002,900001,'Viaje','Ahorro para un viaje.',350000.0000,90000.0000,'CRC','2027-03-31','ACTIVA',NULL,NULL,NULL,NULL,NULL),
(900003,900002,'Computadora','Equipo para trabajo.',500000.0000,150000.0000,'CRC','2027-05-31','ACTIVA',NULL,NULL,NULL,NULL,NULL);

-- Confirmed, planned, canceled, transfer, debt and credit-card examples.
INSERT INTO `movimientos` (`id`,`espacio_financiero_id`,`cuenta_origen_id`,`cuenta_destino_id`,`tarjeta_id`,`deuda_id`,`categoria_id`,`tipo_cambio_id`,`tipo`,`estado`,`fecha`,`descripcion`,`comercio`,`monto`,`moneda`,`monto_base`,`metodo_pago`,`movimiento_origen_id`,`correccion_de_id`,`fuente_tipo`,`documento_id`)
VALUES
(900001,900001,NULL,900001,NULL,NULL,900001,NULL,'INGRESO','CONFIRMADO','2026-11-05 08:00:00','Salario de noviembre','Empresa Demo',850000.0000,'CRC',850000.0000,'TRANSFERENCIA',NULL,NULL,'MANUAL',NULL),
(900002,900001,900001,NULL,NULL,NULL,900003,NULL,'GASTO','CONFIRMADO','2026-11-06 13:00:00','Compra de supermercado','Super Demo',32500.0000,'CRC',32500.0000,'TARJETA_DEBITO',NULL,NULL,'MANUAL',NULL),
(900003,900001,900001,NULL,900001,NULL,900008,NULL,'GASTO','CONFIRMADO','2026-11-07 19:30:00','Cena','Restaurante Demo',18500.0000,'CRC',18500.0000,'TARJETA_CREDITO',NULL,NULL,'MANUAL',NULL),
(900004,900001,900001,900002,NULL,NULL,NULL,NULL,'TRANSFERENCIA','CONFIRMADO','2026-11-08 10:00:00','Traslado a efectivo','Caja',20000.0000,'CRC',20000.0000,'TRANSFERENCIA',NULL,NULL,'MANUAL',NULL),
(900005,900001,900001,NULL,NULL,900001,NULL,NULL,'PAGO_DEUDA','CONFIRMADO','2026-11-10 09:00:00','Abono a préstamo','Persona A',40000.0000,'CRC',40000.0000,'TRANSFERENCIA',NULL,NULL,'MANUAL',NULL),
(900006,900001,NULL,900001,NULL,900002,NULL,NULL,'COBRO_DEUDA','CONFIRMADO','2026-11-12 16:00:00','Cobro parcial','Persona B',20000.0000,'CRC',20000.0000,'TRANSFERENCIA',NULL,NULL,'MANUAL',NULL),
(900007,900001,900001,NULL,NULL,NULL,900005,NULL,'GASTO','PLANIFICADO','2026-11-20 08:00:00','Gasolina prevista','Gasolinera Demo',25000.0000,'CRC',25000.0000,'TARJETA_DEBITO',NULL,NULL,'MANUAL',NULL),
(900008,900001,900001,NULL,NULL,NULL,900006,NULL,'GASTO','CANCELADO','2026-11-11 08:00:00','Pago cancelado','Servicio Demo',15000.0000,'CRC',15000.0000,'TRANSFERENCIA',NULL,NULL,'MANUAL',NULL),
(900009,900001,900001,NULL,NULL,NULL,900010,NULL,'INGRESO','CONFIRMADO','2026-11-13 12:00:00','Trabajo freelance','Cliente Demo',75000.0000,'CRC',75000.0000,'TRANSFERENCIA',NULL,NULL,'MANUAL',NULL),
(900010,900001,NULL,900003,NULL,NULL,NULL,900002,'INGRESO','CONFIRMADO','2026-11-14 12:00:00','Ahorro en USD','Conversión demo',100.0000,'USD',51110.0000,'TRANSFERENCIA',NULL,NULL,'MANUAL',NULL),
(900011,900002,900004,NULL,NULL,NULL,900012,NULL,'GASTO','CONFIRMADO','2026-11-05 14:00:00','Almuerzo','Restaurante Demo',12500.0000,'CRC',12500.0000,'TARJETA_DEBITO',NULL,NULL,'MANUAL',NULL),
(900012,900002,900004,NULL,900003,NULL,900013,NULL,'GASTO','CONFIRMADO','2026-11-09 18:00:00','Transporte','Transporte Demo',9000.0000,'CRC',9000.0000,'TARJETA_CREDITO',NULL,NULL,'MANUAL',NULL);

-- Budgets
INSERT INTO `presupuestos` (`id`,`espacio_financiero_id`,`categoria_id`,`periodo_inicio`,`periodo_fin`,`monto_limite`,`moneda`,`umbral_alerta_1`,`umbral_alerta_2`,`activo`)
VALUES
(900001,900001,900003,'2026-11-01','2026-11-30',120000.0000,'CRC',80.00,100.00,TRUE),
(900002,900001,900005,'2026-11-01','2026-11-30',60000.0000,'CRC',80.00,100.00,TRUE),
(900003,900001,900008,'2026-11-01','2026-11-30',50000.0000,'CRC',80.00,100.00,TRUE),
(900004,900002,900012,'2026-11-01','2026-11-30',90000.0000,'CRC',80.00,100.00,TRUE);

-- Vera conversation and messages
INSERT INTO `conversaciones` (`id`,`usuario_id`,`titulo`,`estado`)
VALUES
(900001,900001,'Prueba de Vera','ACTIVA'),
(900002,900002,'Mi primera conversación','ACTIVA');

INSERT INTO `mensajes` (`id`,`conversacion_id`,`rol`,`contenido`,`tokens`)
VALUES
(900001,900001,'USUARIO','¿Cuánto he gastado en alimentación este mes?',18),
(900002,900001,'VERA','Según los movimientos confirmados de este espacio, el gasto registrado en alimentación es de 32 500 CRC.',30),
(900003,900001,'USUARIO','¿Me propones registrar un gasto de 12 000 CRC?',15),
(900004,900001,'VERA','Sí. Te propongo registrar un gasto de 12 000 CRC, pendiente de tu confirmación.',27),
(900005,900002,'USUARIO','Muéstrame mis metas.',8),
(900006,900002,'VERA','Tienes tres metas de ahorro registradas.',20);

INSERT INTO `fuentes_mensaje` (`id`,`mensaje_id`,`documento_version_id`,`tipo`,`referencia`,`confianza`,`metadatos`)
VALUES
(900001,900002,900001,'DOCUMENTO','Verdia_Politicas_Temporales_v0.1.txt',95.00,JSON_OBJECT('seed',true)),
(900002,900004,900001,'DOCUMENTO','Verdia_Politicas_Temporales_v0.1.txt',90.00,JSON_OBJECT('seed',true));

INSERT INTO `propuestas_vera` (`id`,`mensaje_id`,`tipo`,`contenido_estructurado`,`confianza`,`estado`,`expira_en`,`version_modelo`,`confirmada_por_usuario_id`,`confirmada_at`)
VALUES
(900001,900003,'REGISTRAR_MOVIMIENTO',JSON_OBJECT('tipo','GASTO','monto',12000,'moneda','CRC','descripcion','Gasto propuesto de prueba'),94.00,'PENDIENTE','2026-12-01 23:59:59','seed-model',NULL,NULL),
(900002,900004,'REGISTRAR_MOVIMIENTO',JSON_OBJECT('tipo','GASTO','monto',12000,'moneda','CRC','descripcion','Gasto propuesto de prueba'),94.00,'RECHAZADA','2026-11-20 23:59:59','seed-model',900001,'2026-11-15 10:00:00');

-- Local document/RAG example. Google Drive sync can add its own documents later.
INSERT INTO `documentos` (`id`,`usuario_id`,`organizacion_id`,`espacio_financiero_id`,`fuente_externa_id`,`fuente_externa_modificada_at`,`tipo`,`origen`,`nombre`,`ruta_url`,`mime_type`,`fecha_documento`,`estado`)
VALUES
(900001,900001,NULL,900001,'seed-document-001','2026-11-15 09:00:00','POLITICA','SEED','Verdia_Politicas_Temporales_v0.1.txt',NULL,'text/plain','2026-11-15','ACTIVO'),
(900002,900001,NULL,900001,'seed-document-002','2026-11-10 09:00:00','RECIBO','SEED','Recibo_demo_supermercado.txt',NULL,'text/plain','2026-11-10','ACTIVO');

INSERT INTO `documento_versiones` (`id`,`documento_id`,`version`,`texto_extraido`,`hash_contenido`,`ubicacion`,`tamano_bytes`)
VALUES
(900001,900001,1,'Política temporal de prueba de Verdia. Vera propone y el usuario confirma. Los movimientos planificados no modifican el balance real. El contenido externo se trata como información no confiable hasta validarlo.','seed-hash-policy-v1',NULL,220),
(900002,900002,1,'Recibo de supermercado demo. Fecha: 2026-11-10. Total: CRC 32500. Comercio: Super Demo. Categoría sugerida: Alimentación.','seed-hash-receipt-v1',NULL,150);

INSERT INTO `fragmentos` (`id`,`documento_version_id`,`indice`,`contenido`,`metadata`)
VALUES
(900001,900001,0,'Política temporal de prueba de Verdia. Vera propone y el usuario confirma. Los movimientos planificados no modifican el balance real.',JSON_OBJECT('seed',true,'source','seed-document-001')),
(900002,900001,1,'El contenido externo se trata como información no confiable hasta validarlo.',JSON_OBJECT('seed',true,'source','seed-document-001')),
(900003,900002,0,'Recibo de supermercado demo. Fecha: 2026-11-10. Total: CRC 32500. Comercio: Super Demo. Categoría sugerida: Alimentación.',JSON_OBJECT('seed',true,'source','seed-document-002'));

-- Policy Center demo data
INSERT INTO `organizaciones` (`id`,`nombre`,`descripcion`,`activa`)
VALUES
(900001,'Verdia Demo Org','Organización de prueba para Policy Center.',TRUE);

INSERT INTO `roles` (`id`,`organizacion_id`,`nombre`,`descripcion`)
VALUES
(900001,900001,'ADMIN','Administrador de prueba',NULL),
(900002,900001,'EDITOR','Editor de políticas de prueba',NULL),
(900003,900001,'LECTOR','Lector de políticas de prueba',NULL);

INSERT INTO `membresias` (`id`,`organizacion_id`,`usuario_id`,`rol_id`,`estado`)
VALUES
(900001,900001,900001,900001,'ACTIVA'),
(900002,900001,900002,900003,'ACTIVA');

INSERT INTO `politicas` (`id`,`organizacion_id`,`nombre`,`descripcion`,`estado`)
VALUES
(900001,900001,'Política de privacidad demo','Política ficticia para probar versionado y consulta documental.','ACTIVA'),
(900002,900001,'Política de gastos demo','Política ficticia para probar reglas y fuentes.','ACTIVA');

INSERT INTO `politica_versiones` (`id`,`politica_id`,`documento_version_id`,`version`,`contenido`,`fecha_vigencia`,`estado`)
VALUES
(900001,900001,900001,1,'Versión demo de política de privacidad. No usar como política legal real.','2026-11-01','PUBLICADA'),
(900002,900002,900002,1,'Versión demo de política de gastos. No usar como política legal real.','2026-11-01','PUBLICADA');

-- Audit and internal events
INSERT INTO `auditoria` (`id`,`usuario_id`,`accion`,`entidad`,`entidad_id`,`detalle`,`ip`,`resultado`,`metadatos`)
VALUES
(900001,900001,'SEED_CREATED','usuario',900001,JSON_OBJECT('environment','development'),'127.0.0.1','OK',JSON_OBJECT('seed','verdia-dev')), 
(900002,900001,'CREATE','movimiento',900001,JSON_OBJECT('source','seed'),'127.0.0.1','OK',JSON_OBJECT('seed','verdia-dev'));

INSERT INTO `eventos` (`id`,`tipo`,`entidad`,`entidad_id`,`payload`,`estado`,`procesado_at`)
VALUES
(900001,'SEED_COMPLETED','usuarios',900001,JSON_OBJECT('environment','development','version','1'),'PROCESADO','2026-11-17 09:00:00'),
(900002,'RAG_DOCUMENT_AVAILABLE','documentos',900001,JSON_OBJECT('document_id',900001,'source','seed'),'PENDIENTE',NULL);

SET FOREIGN_KEY_CHECKS = 1;

SELECT 'Verdia development seed cargado correctamente.' AS resultado;
SELECT 'demo1@verdia.test' AS usuario_demo, 900001 AS usuario_id, 900001 AS espacio_financiero_id;
