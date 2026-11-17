import { defineModel, DataTypes } from './_factory.js';

export function initPropuestaVera(sequelize) {
  return defineModel(sequelize, 'PropuestaVera', 'propuestas_vera', {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    mensaje_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    tipo: { type: DataTypes.STRING(255), allowNull: false },
    contenido_estructurado: { type: DataTypes.JSON, allowNull: true },
    confianza: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
    estado: { type: DataTypes.ENUM('PENDIENTE','CONFIRMADA','RECHAZADA','EXPIRADA'), allowNull: false },
    expira_en: { type: DataTypes.DATE, allowNull: true },
    version_modelo: { type: DataTypes.STRING(255), allowNull: true },
    confirmada_por_usuario_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    confirmada_at: { type: DataTypes.DATE, allowNull: true },
  });
}
