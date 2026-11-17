import { defineModel, DataTypes } from './_factory.js';

export function initRol(sequelize) {
  return defineModel(sequelize, 'Rol', 'roles', {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    organizacion_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    nombre: { type: DataTypes.STRING(255), allowNull: false },
    descripcion: { type: DataTypes.STRING(255), allowNull: true },
  });
}
