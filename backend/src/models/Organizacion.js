import { defineModel, DataTypes } from './_factory.js';

export function initOrganizacion(sequelize) {
  return defineModel(sequelize, 'Organizacion', 'organizaciones', {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING(255), allowNull: false },
    descripcion: { type: DataTypes.STRING(255), allowNull: true },
    activa: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  });
}
