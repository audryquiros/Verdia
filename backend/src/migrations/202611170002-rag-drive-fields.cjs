'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const columns = await queryInterface.describeTable('documentos');
    if (!columns.espacio_financiero_id) {
      await queryInterface.addColumn('documentos', 'espacio_financiero_id', {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
      });
    }
    if (!columns.fuente_externa_id) {
      await queryInterface.addColumn('documentos', 'fuente_externa_id', {
        type: Sequelize.STRING(255),
        allowNull: true,
      });
    }
    if (!columns.fuente_externa_modificada_at) {
      await queryInterface.addColumn('documentos', 'fuente_externa_modificada_at', {
        type: Sequelize.DATE,
        allowNull: true,
      });
    }

    const indexes = await queryInterface.showIndex('documentos');
    if (!indexes.some((index) => index.name === 'uq_documentos_espacio_fuente_externa')) {
      await queryInterface.addIndex('documentos', ['espacio_financiero_id', 'fuente_externa_id'], {
        name: 'uq_documentos_espacio_fuente_externa',
        unique: true,
      });
    }

    const fragmentIndexes = await queryInterface.showIndex('fragmentos');
    if (!fragmentIndexes.some((index) => index.name === 'ft_fragmentos_contenido')) {
      await queryInterface.addIndex('fragmentos', ['contenido'], {
        name: 'ft_fragmentos_contenido',
        type: 'FULLTEXT',
      });
    }

    try {
      await queryInterface.addConstraint('documentos', {
        fields: ['espacio_financiero_id'],
        type: 'foreign key',
        name: 'fk_documentos_espacio',
        references: { table: 'espacios_financieros', field: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
    } catch (error) {
      if (!/already exists|Duplicate|exists/i.test(error.message)) throw error;
    }
  },

  async down(queryInterface) {
    try { await queryInterface.removeConstraint('documentos', 'fk_documentos_espacio'); } catch {}
    try { await queryInterface.removeIndex('fragmentos', 'ft_fragmentos_contenido'); } catch {}
    try { await queryInterface.removeIndex('documentos', 'uq_documentos_espacio_fuente_externa'); } catch {}
    const columns = await queryInterface.describeTable('documentos');
    if (columns.fuente_externa_modificada_at) await queryInterface.removeColumn('documentos', 'fuente_externa_modificada_at');
    if (columns.fuente_externa_id) await queryInterface.removeColumn('documentos', 'fuente_externa_id');
    if (columns.espacio_financiero_id) await queryInterface.removeColumn('documentos', 'espacio_financiero_id');
  },
};
