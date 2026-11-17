import { defineModel, DataTypes } from './_factory.js';

export function initEspacioFinanciero(sequelize) {
  return defineModel(sequelize, 'EspacioFinanciero', 'espacios_financieros', {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    usuario_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    nombre: { type: DataTypes.STRING(255), allowNull: false },
    tipo: { type: DataTypes.STRING(255), allowNull: false },
    moneda_principal: { type: DataTypes.CHAR(3), allowNull: false, defaultValue: 'CRC' },
    saldo_inicial: { type: DataTypes.DECIMAL(19, 4), allowNull: false },
    saldo_inicial_fecha: { type: DataTypes.DATE, allowNull: true },
    activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  });
}
