import { defineModel, DataTypes } from './_factory.js';

export function initMovimiento(sequelize) {
  return defineModel(sequelize, 'Movimiento', 'movimientos', {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    espacio_financiero_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    cuenta_origen_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    cuenta_destino_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    tarjeta_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    deuda_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    categoria_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    tipo_cambio_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    tipo: { type: DataTypes.ENUM('INGRESO','GASTO','TRANSFERENCIA','PRESTAMO_RECIBIDO','PRESTAMO_DADO','COBRO_DEUDA','PAGO_DEUDA'), allowNull: false },
    estado: { type: DataTypes.ENUM('PLANIFICADO','CONFIRMADO','CANCELADO'), allowNull: false },
    fecha: { type: DataTypes.DATE, allowNull: false },
    descripcion: { type: DataTypes.STRING(255), allowNull: true },
    comercio: { type: DataTypes.STRING(255), allowNull: true },
    monto: { type: DataTypes.DECIMAL(19, 4), allowNull: false },
    moneda: { type: DataTypes.CHAR(3), allowNull: false, defaultValue: 'CRC' },
    monto_base: { type: DataTypes.DECIMAL(19, 4), allowNull: true },
    metodo_pago: { type: DataTypes.STRING(255), allowNull: true },
    movimiento_origen_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    correccion_de_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    fuente_tipo: { type: DataTypes.STRING(255), allowNull: true },
    documento_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
  });
}
