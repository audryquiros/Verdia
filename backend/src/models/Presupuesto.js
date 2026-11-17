import { defineModel, DataTypes } from './_factory.js';

export function initPresupuesto(sequelize) {
  return defineModel(sequelize, 'Presupuesto', 'presupuestos', {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    espacio_financiero_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    categoria_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    periodo_inicio: { type: DataTypes.DATE, allowNull: false },
    periodo_fin: { type: DataTypes.DATE, allowNull: false },
    monto_limite: { type: DataTypes.DECIMAL(19, 4), allowNull: false },
    moneda: { type: DataTypes.CHAR(3), allowNull: false, defaultValue: 'CRC' },
    umbral_alerta_1: { type: DataTypes.DECIMAL(5, 2), allowNull: false },
    umbral_alerta_2: { type: DataTypes.DECIMAL(5, 2), allowNull: false },
    activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  });
}
