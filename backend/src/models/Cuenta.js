import { defineModel, DataTypes } from './_factory.js';

export function initCuenta(sequelize) {
  return defineModel(sequelize, 'Cuenta', 'cuentas', {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    espacio_financiero_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    nombre: { type: DataTypes.STRING(255), allowNull: false },
    tipo: { type: DataTypes.ENUM('EFECTIVO','BANCO','AHORRO','OTRO'), allowNull: false },
    institucion: { type: DataTypes.STRING(255), allowNull: true },
    moneda: { type: DataTypes.CHAR(3), allowNull: false, defaultValue: 'CRC' },
    saldo_inicial: { type: DataTypes.DECIMAL(19, 4), allowNull: false },
    activa: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  });
}
