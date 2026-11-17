import { defineModel, DataTypes } from './_factory.js';

export function initPolitica(sequelize) {
  return defineModel(sequelize, 'Politica', 'politicas', {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    organizacion_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    nombre: { type: DataTypes.STRING(255), allowNull: false },
    descripcion: { type: DataTypes.TEXT('medium'), allowNull: true },
    estado: { type: DataTypes.STRING(255), allowNull: false },
  });
}
