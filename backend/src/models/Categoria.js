import { defineModel, DataTypes } from './_factory.js';

export function initCategoria(sequelize) {
  return defineModel(sequelize, 'Categoria', 'categorias', {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    espacio_financiero_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    nombre: { type: DataTypes.STRING(255), allowNull: false },
    tipo: { type: DataTypes.ENUM('INGRESO','GASTO'), allowNull: false },
    categoria_padre_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    sistema: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    color: { type: DataTypes.STRING(255), allowNull: true },
    icono: { type: DataTypes.STRING(255), allowNull: true },
    activa: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  });
}
