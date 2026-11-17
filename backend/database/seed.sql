USE `verdia`;

INSERT INTO `categorias` (`espacio_financiero_id`,`nombre`,`tipo`,`sistema`,`activa`)
SELECT NULL, 'Salario', 'INGRESO', TRUE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM `categorias` WHERE `espacio_financiero_id` IS NULL AND `nombre`='Salario' AND `tipo`='INGRESO');

INSERT INTO `categorias` (`espacio_financiero_id`,`nombre`,`tipo`,`sistema`,`activa`)
SELECT NULL, 'Otros ingresos', 'INGRESO', TRUE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM `categorias` WHERE `espacio_financiero_id` IS NULL AND `nombre`='Otros ingresos' AND `tipo`='INGRESO');

INSERT INTO `categorias` (`espacio_financiero_id`,`nombre`,`tipo`,`sistema`,`activa`)
SELECT NULL, 'Alimentación', 'GASTO', TRUE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM `categorias` WHERE `espacio_financiero_id` IS NULL AND `nombre`='Alimentación' AND `tipo`='GASTO');

INSERT INTO `categorias` (`espacio_financiero_id`,`nombre`,`tipo`,`sistema`,`activa`)
SELECT NULL, 'Vivienda', 'GASTO', TRUE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM `categorias` WHERE `espacio_financiero_id` IS NULL AND `nombre`='Vivienda' AND `tipo`='GASTO');

INSERT INTO `categorias` (`espacio_financiero_id`,`nombre`,`tipo`,`sistema`,`activa`)
SELECT NULL, 'Transporte', 'GASTO', TRUE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM `categorias` WHERE `espacio_financiero_id` IS NULL AND `nombre`='Transporte' AND `tipo`='GASTO');

INSERT INTO `categorias` (`espacio_financiero_id`,`nombre`,`tipo`,`sistema`,`activa`)
SELECT NULL, 'Servicios', 'GASTO', TRUE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM `categorias` WHERE `espacio_financiero_id` IS NULL AND `nombre`='Servicios' AND `tipo`='GASTO');

INSERT INTO `categorias` (`espacio_financiero_id`,`nombre`,`tipo`,`sistema`,`activa`)
SELECT NULL, 'Salud', 'GASTO', TRUE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM `categorias` WHERE `espacio_financiero_id` IS NULL AND `nombre`='Salud' AND `tipo`='GASTO');

INSERT INTO `categorias` (`espacio_financiero_id`,`nombre`,`tipo`,`sistema`,`activa`)
SELECT NULL, 'Entretenimiento', 'GASTO', TRUE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM `categorias` WHERE `espacio_financiero_id` IS NULL AND `nombre`='Entretenimiento' AND `tipo`='GASTO');
