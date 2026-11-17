import { defineModel, DataTypes } from './_factory.js';

export function initDeuda(sequelize) {
  return defineModel(sequelize, 'Deuda', 'deudas', {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    espacio_financiero_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    tipo: { type: DataTypes.ENUM('POR_PAGAR','POR_COBRAR'), allowNull: false },
    nombre: { type: DataTypes.STRING(255), allowNull: false },
    tercero_alias: { type: DataTypes.STRING(255), allowNull: true },
    monto_original: { type: DataTypes.DECIMAL(19, 4), allowNull: false },
    moneda: { type: DataTypes.CHAR(3), allowNull: false, defaultValue: 'CRC' },
    saldo_actual: { type: DataTypes.DECIMAL(19, 4), allowNull: false },
    fecha_inicio: { type: DataTypes.DATE, allowNull: true },
    fecha_vencimiento: { type: DataTypes.DATE, allowNull: true },
    tasa_interes: { type: DataTypes.DECIMAL(19, 4), allowNull: true },
    estado: { type: DataTypes.ENUM('ACTIVA','PAGADA','CANCELADA'), allowNull: false },
  });
}
