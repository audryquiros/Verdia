import { defineModel, DataTypes } from './_factory.js';

export function initMeta(sequelize) {
  return defineModel(sequelize, 'Meta', 'metas', {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    espacio_financiero_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    nombre: { type: DataTypes.STRING(255), allowNull: false },
    descripcion: { type: DataTypes.TEXT('medium'), allowNull: true },
    monto_objetivo: { type: DataTypes.DECIMAL(19, 4), allowNull: false },
    monto_actual: { type: DataTypes.DECIMAL(19, 4), allowNull: false },
    moneda: { type: DataTypes.CHAR(3), allowNull: false, defaultValue: 'CRC' },
    fecha_objetivo: { type: DataTypes.DATE, allowNull: true },
    estado: { type: DataTypes.ENUM('ACTIVA','CUMPLIDA','PAUSADA','CANCELADA'), allowNull: false },
    institucion: { type: DataTypes.STRING(255), allowNull: true },
    tipo_cuenta: { type: DataTypes.STRING(255), allowNull: true },
    saldo_actual: { type: DataTypes.DECIMAL(19, 4), allowNull: true },
    tasa_interes: { type: DataTypes.DECIMAL(19, 4), allowNull: true },
    beneficio_estimado: { type: DataTypes.DECIMAL(19, 4), allowNull: true },
  });
}
