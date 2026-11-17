import { defineModel, DataTypes } from './_factory.js';

export function initTipoCambio(sequelize) {
  return defineModel(sequelize, 'TipoCambio', 'tipos_cambio', {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    moneda_origen: { type: DataTypes.CHAR(3), allowNull: false, defaultValue: 'CRC' },
    moneda_destino: { type: DataTypes.CHAR(3), allowNull: false, defaultValue: 'CRC' },
    tasa: { type: DataTypes.DECIMAL(19, 8), allowNull: false },
    fuente: { type: DataTypes.STRING(255), allowNull: true },
    fecha_tasa: { type: DataTypes.DATE, allowNull: false },
  });
}
