import { defineModel, DataTypes } from './_factory.js';

export function initTarjeta(sequelize) {
  return defineModel(sequelize, 'Tarjeta', 'tarjetas', {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    espacio_financiero_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    cuenta_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    alias: { type: DataTypes.STRING(255), allowNull: false },
    tipo: { type: DataTypes.ENUM('DEBITO','CREDITO'), allowNull: false },
    ultimos_4: { type: DataTypes.CHAR(4), allowNull: true },
    fecha_corte: { type: DataTypes.TINYINT.UNSIGNED, allowNull: true },
    fecha_vencimiento_pago: { type: DataTypes.TINYINT.UNSIGNED, allowNull: true },
    fecha_vencimiento_minimo: { type: DataTypes.TINYINT.UNSIGNED, allowNull: true },
    tasa_interes_actual: { type: DataTypes.DECIMAL(19, 4), allowNull: true },
    tasa_penalizacion: { type: DataTypes.DECIMAL(19, 4), allowNull: true },
    limite_credito: { type: DataTypes.DECIMAL(19, 4), allowNull: true },
    activa: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  });
}
