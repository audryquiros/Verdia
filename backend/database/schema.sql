SET NAMES utf8mb4;
CREATE DATABASE IF NOT EXISTS `verdia` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `verdia`;

CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255),
  `nombre` VARCHAR(120),
  `apellido` VARCHAR(120),
  `foto_url` VARCHAR(500),
  `estado` ENUM('ACTIVO','BLOQUEADO','ELIMINADO') NOT NULL DEFAULT 'ACTIVO',
  `email_verificado_at` DATETIME,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `sesiones` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` BIGINT NOT NULL,
  `token_hash` VARCHAR(255) NOT NULL UNIQUE,
  `ip` VARCHAR(45),
  `user_agent` VARCHAR(500),
  `expira_at` DATETIME NOT NULL,
  `revocada_at` DATETIME,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_sesiones_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `organizaciones` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(160) NOT NULL,
  `descripcion` VARCHAR(255),
  `activa` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `roles` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `organizacion_id` BIGINT,
  `nombre` VARCHAR(80) NOT NULL,
  `descripcion` VARCHAR(255),
  CONSTRAINT `fk_roles_org` FOREIGN KEY (`organizacion_id`) REFERENCES `organizaciones`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `espacios_financieros` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` BIGINT NOT NULL,
  `nombre` VARCHAR(120) NOT NULL,
  `tipo` VARCHAR(40) NOT NULL DEFAULT 'PERSONAL',
  `moneda_principal` CHAR(3) NOT NULL DEFAULT 'CRC',
  `saldo_inicial` DECIMAL(19,4) NOT NULL DEFAULT 0,
  `saldo_inicial_fecha` DATE,
  `activo` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_espacios_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `cuentas` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `espacio_financiero_id` BIGINT NOT NULL,
  `nombre` VARCHAR(120) NOT NULL,
  `tipo` ENUM('EFECTIVO','BANCO','AHORRO','OTRO') NOT NULL DEFAULT 'BANCO',
  `institucion` VARCHAR(160),
  `moneda` CHAR(3) NOT NULL DEFAULT 'CRC',
  `saldo_inicial` DECIMAL(19,4) NOT NULL DEFAULT 0,
  `activa` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_cuentas_espacio` FOREIGN KEY (`espacio_financiero_id`) REFERENCES `espacios_financieros`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `tarjetas` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `espacio_financiero_id` BIGINT NOT NULL,
  `cuenta_id` BIGINT,
  `alias` VARCHAR(80) NOT NULL,
  `tipo` ENUM('DEBITO','CREDITO') NOT NULL,
  `ultimos_4` CHAR(4),
  `fecha_corte` TINYINT UNSIGNED,
  `fecha_vencimiento_pago` TINYINT UNSIGNED,
  `fecha_vencimiento_minimo` TINYINT UNSIGNED,
  `tasa_interes_actual` DECIMAL(9,4),
  `tasa_penalizacion` DECIMAL(9,4),
  `limite_credito` DECIMAL(19,4),
  `activa` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_tarjetas_espacio` FOREIGN KEY (`espacio_financiero_id`) REFERENCES `espacios_financieros`(`id`),
  CONSTRAINT `fk_tarjetas_cuenta` FOREIGN KEY (`cuenta_id`) REFERENCES `cuentas`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `categorias` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `espacio_financiero_id` BIGINT,
  `nombre` VARCHAR(100) NOT NULL,
  `tipo` ENUM('INGRESO','GASTO') NOT NULL,
  `categoria_padre_id` BIGINT,
  `sistema` BOOLEAN NOT NULL DEFAULT FALSE,
  `color` VARCHAR(20),
  `icono` VARCHAR(60),
  `activa` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_categorias_espacio` FOREIGN KEY (`espacio_financiero_id`) REFERENCES `espacios_financieros`(`id`),
  CONSTRAINT `fk_categorias_padre` FOREIGN KEY (`categoria_padre_id`) REFERENCES `categorias`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `tipos_cambio` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `moneda_origen` CHAR(3) NOT NULL,
  `moneda_destino` CHAR(3) NOT NULL,
  `tasa` DECIMAL(19,8) NOT NULL,
  `fuente` VARCHAR(120),
  `fecha_tasa` DATE NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_tipo_cambio` (`moneda_origen`,`moneda_destino`,`fecha_tasa`,`fuente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `deudas` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `espacio_financiero_id` BIGINT NOT NULL,
  `tipo` ENUM('POR_PAGAR','POR_COBRAR') NOT NULL,
  `nombre` VARCHAR(160) NOT NULL,
  `tercero_alias` VARCHAR(120),
  `monto_original` DECIMAL(19,4) NOT NULL,
  `moneda` CHAR(3) NOT NULL DEFAULT 'CRC',
  `saldo_actual` DECIMAL(19,4) NOT NULL,
  `fecha_inicio` DATE,
  `fecha_vencimiento` DATE,
  `tasa_interes` DECIMAL(9,4),
  `estado` ENUM('ACTIVA','PAGADA','CANCELADA') NOT NULL DEFAULT 'ACTIVA',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_deudas_espacio` FOREIGN KEY (`espacio_financiero_id`) REFERENCES `espacios_financieros`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `metas` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `espacio_financiero_id` BIGINT NOT NULL,
  `nombre` VARCHAR(160) NOT NULL,
  `descripcion` TEXT,
  `monto_objetivo` DECIMAL(19,4) NOT NULL,
  `monto_actual` DECIMAL(19,4) NOT NULL DEFAULT 0,
  `moneda` CHAR(3) NOT NULL DEFAULT 'CRC',
  `fecha_objetivo` DATE,
  `estado` ENUM('ACTIVA','CUMPLIDA','PAUSADA','CANCELADA') NOT NULL DEFAULT 'ACTIVA',
  `institucion` VARCHAR(160),
  `tipo_cuenta` VARCHAR(60),
  `saldo_actual` DECIMAL(19,4),
  `tasa_interes` DECIMAL(9,4),
  `beneficio_estimado` DECIMAL(19,4),
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_metas_espacio` FOREIGN KEY (`espacio_financiero_id`) REFERENCES `espacios_financieros`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `documentos` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` BIGINT,
  `organizacion_id` BIGINT,
  `tipo` VARCHAR(80) NOT NULL,
  `origen` VARCHAR(80) NOT NULL,
  `nombre` VARCHAR(255) NOT NULL,
  `ruta_url` VARCHAR(1000),
  `mime_type` VARCHAR(120),
  `fecha_documento` DATE,
  `estado` VARCHAR(30) NOT NULL DEFAULT 'ACTIVO',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_doc_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `documento_versiones` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `documento_id` BIGINT NOT NULL,
  `version` INT UNSIGNED NOT NULL,
  `texto_extraido` LONGTEXT,
  `hash_contenido` VARCHAR(128),
  `ubicacion` VARCHAR(1000),
  `tamano_bytes` BIGINT UNSIGNED,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_doc_version` (`documento_id`,`version`),
  CONSTRAINT `fk_docver_doc` FOREIGN KEY (`documento_id`) REFERENCES `documentos`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `fragmentos` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `documento_version_id` BIGINT NOT NULL,
  `indice` INT UNSIGNED NOT NULL,
  `contenido` TEXT NOT NULL,
  `metadata` JSON,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_frag_version` FOREIGN KEY (`documento_version_id`) REFERENCES `documento_versiones`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `movimientos` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `espacio_financiero_id` BIGINT NOT NULL,
  `cuenta_origen_id` BIGINT,
  `cuenta_destino_id` BIGINT,
  `tarjeta_id` BIGINT,
  `deuda_id` BIGINT,
  `categoria_id` BIGINT,
  `tipo_cambio_id` BIGINT,
  `tipo` ENUM('INGRESO','GASTO','TRANSFERENCIA','PRESTAMO_RECIBIDO','PRESTAMO_DADO','COBRO_DEUDA','PAGO_DEUDA') NOT NULL,
  `estado` ENUM('PLANIFICADO','CONFIRMADO','CANCELADO') NOT NULL DEFAULT 'PLANIFICADO',
  `fecha` DATETIME NOT NULL,
  `descripcion` VARCHAR(255),
  `comercio` VARCHAR(160),
  `monto` DECIMAL(19,4) NOT NULL,
  `moneda` CHAR(3) NOT NULL DEFAULT 'CRC',
  `monto_base` DECIMAL(19,4),
  `metodo_pago` VARCHAR(40),
  `movimiento_origen_id` BIGINT,
  `correccion_de_id` BIGINT,
  `fuente_tipo` VARCHAR(30),
  `documento_id` BIGINT,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_mov_espacio` FOREIGN KEY (`espacio_financiero_id`) REFERENCES `espacios_financieros`(`id`),
  CONSTRAINT `fk_mov_origen` FOREIGN KEY (`cuenta_origen_id`) REFERENCES `cuentas`(`id`),
  CONSTRAINT `fk_mov_destino` FOREIGN KEY (`cuenta_destino_id`) REFERENCES `cuentas`(`id`),
  CONSTRAINT `fk_mov_tarjeta` FOREIGN KEY (`tarjeta_id`) REFERENCES `tarjetas`(`id`),
  CONSTRAINT `fk_mov_deuda` FOREIGN KEY (`deuda_id`) REFERENCES `deudas`(`id`),
  CONSTRAINT `fk_mov_categoria` FOREIGN KEY (`categoria_id`) REFERENCES `categorias`(`id`),
  CONSTRAINT `fk_mov_tipo_cambio` FOREIGN KEY (`tipo_cambio_id`) REFERENCES `tipos_cambio`(`id`),
  CONSTRAINT `fk_mov_documento` FOREIGN KEY (`documento_id`) REFERENCES `documentos`(`id`),
  CONSTRAINT `fk_mov_origen_mov` FOREIGN KEY (`movimiento_origen_id`) REFERENCES `movimientos`(`id`),
  CONSTRAINT `fk_mov_correccion` FOREIGN KEY (`correccion_de_id`) REFERENCES `movimientos`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `presupuestos` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `espacio_financiero_id` BIGINT NOT NULL,
  `categoria_id` BIGINT NOT NULL,
  `periodo_inicio` DATE NOT NULL,
  `periodo_fin` DATE NOT NULL,
  `monto_limite` DECIMAL(19,4) NOT NULL,
  `moneda` CHAR(3) NOT NULL DEFAULT 'CRC',
  `umbral_alerta_1` DECIMAL(5,2) NOT NULL DEFAULT 80,
  `umbral_alerta_2` DECIMAL(5,2) NOT NULL DEFAULT 100,
  `activo` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_pres_espacio` FOREIGN KEY (`espacio_financiero_id`) REFERENCES `espacios_financieros`(`id`),
  CONSTRAINT `fk_pres_categoria` FOREIGN KEY (`categoria_id`) REFERENCES `categorias`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `conversaciones` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` BIGINT NOT NULL,
  `titulo` VARCHAR(160),
  `estado` ENUM('ACTIVA','CERRADA') NOT NULL DEFAULT 'ACTIVA',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_conv_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `mensajes` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `conversacion_id` BIGINT NOT NULL,
  `rol` ENUM('USUARIO','VERA','SISTEMA') NOT NULL,
  `contenido` TEXT NOT NULL,
  `tokens` INT UNSIGNED,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_mensajes_conv` FOREIGN KEY (`conversacion_id`) REFERENCES `conversaciones`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `fuentes_mensaje` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `mensaje_id` BIGINT NOT NULL,
  `documento_version_id` BIGINT,
  `tipo` VARCHAR(40) NOT NULL,
  `referencia` VARCHAR(255),
  `confianza` DECIMAL(5,2),
  `metadatos` JSON,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_fuente_mensaje` FOREIGN KEY (`mensaje_id`) REFERENCES `mensajes`(`id`),
  CONSTRAINT `fk_fuente_docver` FOREIGN KEY (`documento_version_id`) REFERENCES `documento_versiones`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `propuestas_vera` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `mensaje_id` BIGINT NOT NULL,
  `tipo` VARCHAR(40) NOT NULL,
  `contenido_estructurado` JSON,
  `confianza` DECIMAL(5,2),
  `estado` ENUM('PENDIENTE','CONFIRMADA','RECHAZADA','EXPIRADA') NOT NULL DEFAULT 'PENDIENTE',
  `expira_en` DATETIME,
  `version_modelo` VARCHAR(80),
  `confirmada_por_usuario_id` BIGINT,
  `confirmada_at` DATETIME,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_prop_mensaje` FOREIGN KEY (`mensaje_id`) REFERENCES `mensajes`(`id`),
  CONSTRAINT `fk_prop_usuario` FOREIGN KEY (`confirmada_por_usuario_id`) REFERENCES `usuarios`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `membresias` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `organizacion_id` BIGINT NOT NULL,
  `usuario_id` BIGINT NOT NULL,
  `rol_id` BIGINT NOT NULL,
  `estado` VARCHAR(30) NOT NULL DEFAULT 'ACTIVA',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_mem_org` FOREIGN KEY (`organizacion_id`) REFERENCES `organizaciones`(`id`),
  CONSTRAINT `fk_mem_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`),
  CONSTRAINT `fk_mem_rol` FOREIGN KEY (`rol_id`) REFERENCES `roles`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `politicas` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `organizacion_id` BIGINT NOT NULL,
  `nombre` VARCHAR(160) NOT NULL,
  `descripcion` TEXT,
  `estado` VARCHAR(30) NOT NULL DEFAULT 'ACTIVA',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_pol_org` FOREIGN KEY (`organizacion_id`) REFERENCES `organizaciones`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `politica_versiones` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `politica_id` BIGINT NOT NULL,
  `documento_version_id` BIGINT,
  `version` INT UNSIGNED NOT NULL,
  `contenido` LONGTEXT,
  `fecha_vigencia` DATE,
  `estado` VARCHAR(30) NOT NULL DEFAULT 'BORRADOR',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_polver_pol` FOREIGN KEY (`politica_id`) REFERENCES `politicas`(`id`),
  CONSTRAINT `fk_polver_docver` FOREIGN KEY (`documento_version_id`) REFERENCES `documento_versiones`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `auditoria` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` BIGINT,
  `accion` VARCHAR(100) NOT NULL,
  `entidad` VARCHAR(100),
  `entidad_id` BIGINT,
  `detalle` JSON,
  `ip` VARCHAR(45),
  `resultado` VARCHAR(30),
  `metadatos` JSON,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_aud_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `eventos` (
  `id` BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `tipo` VARCHAR(100) NOT NULL,
  `entidad` VARCHAR(100),
  `entidad_id` BIGINT,
  `payload` JSON,
  `estado` VARCHAR(30) NOT NULL DEFAULT 'PENDIENTE',
  `procesado_at` DATETIME,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
