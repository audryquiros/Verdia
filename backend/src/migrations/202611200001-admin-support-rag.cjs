'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tables = await queryInterface.showAllTables();
    const normalized = tables.map((table) => String(table).toLowerCase());

    const users = await queryInterface.describeTable('usuarios');
    if (!users.rol) {
      await queryInterface.addColumn('usuarios', 'rol', {
        type: Sequelize.ENUM('USUARIO', 'ADMIN'),
        allowNull: false,
        defaultValue: 'USUARIO',
      });
    }

    const docs = await queryInterface.describeTable('documentos');
    if (!docs.descripcion) await queryInterface.addColumn('documentos', 'descripcion', { type: Sequelize.STRING(500), allowNull: true });
    if (!docs.subido_por_usuario_id) await queryInterface.addColumn('documentos', 'subido_por_usuario_id', { type: Sequelize.BIGINT.UNSIGNED, allowNull: true });
    if (!docs.publicado_at) await queryInterface.addColumn('documentos', 'publicado_at', { type: Sequelize.DATE, allowNull: true });

    if (!normalized.includes('casos_soporte')) {
      await queryInterface.createTable('casos_soporte', {
        id: { type: Sequelize.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
        usuario_id: { type: Sequelize.BIGINT.UNSIGNED, allowNull: false, references: { model: 'usuarios', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
        asignado_a_usuario_id: { type: Sequelize.BIGINT.UNSIGNED, allowNull: true, references: { model: 'usuarios', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
        asunto: { type: Sequelize.STRING(180), allowNull: false },
        estado: { type: Sequelize.ENUM('NUEVO','EN_PROGRESO','ESPERANDO_USUARIO','RESUELTO','CERRADO'), allowNull: false, defaultValue: 'NUEVO' },
        prioridad: { type: Sequelize.ENUM('BAJA','NORMAL','ALTA','URGENTE'), allowNull: false, defaultValue: 'NORMAL' },
        origen: { type: Sequelize.ENUM('USUARIO','VERA','SISTEMA'), allowNull: false, defaultValue: 'USUARIO' },
        mensaje_inicial: { type: Sequelize.TEXT, allowNull: false },
        resuelto_at: { type: Sequelize.DATE, allowNull: true },
        created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
        updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') },
      });
    }

    if (!normalized.includes('mensajes_soporte')) {
      await queryInterface.createTable('mensajes_soporte', {
        id: { type: Sequelize.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
        caso_soporte_id: { type: Sequelize.BIGINT.UNSIGNED, allowNull: false, references: { model: 'casos_soporte', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
        autor_tipo: { type: Sequelize.ENUM('USUARIO','ADMIN','SISTEMA'), allowNull: false },
        autor_usuario_id: { type: Sequelize.BIGINT.UNSIGNED, allowNull: true, references: { model: 'usuarios', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
        contenido: { type: Sequelize.TEXT, allowNull: false },
        created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
        updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP') },
      });
    }

    for (const [table, fields, name] of [
      ['casos_soporte', ['usuario_id', 'estado'], 'idx_soporte_usuario_estado'],
      ['casos_soporte', ['estado', 'prioridad', 'updated_at'], 'idx_soporte_admin_queue'],
      ['mensajes_soporte', ['caso_soporte_id', 'created_at'], 'idx_soporte_mensajes'],
      ['documentos', ['origen', 'estado'], 'idx_documentos_rag_admin'],
    ]) {
      const indexes = await queryInterface.showIndex(table);
      if (!indexes.some((index) => index.name === name)) await queryInterface.addIndex(table, fields, { name });
    }
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('documentos', 'idx_documentos_rag_admin').catch(() => {});
    await queryInterface.removeIndex('mensajes_soporte', 'idx_soporte_mensajes').catch(() => {});
    await queryInterface.removeIndex('casos_soporte', 'idx_soporte_admin_queue').catch(() => {});
    await queryInterface.removeIndex('casos_soporte', 'idx_soporte_usuario_estado').catch(() => {});
    const tables = (await queryInterface.showAllTables()).map((table) => String(table).toLowerCase());
    if (tables.includes('mensajes_soporte')) await queryInterface.dropTable('mensajes_soporte');
    if (tables.includes('casos_soporte')) await queryInterface.dropTable('casos_soporte');
    const docs = await queryInterface.describeTable('documentos');
    if (docs.publicado_at) await queryInterface.removeColumn('documentos', 'publicado_at');
    if (docs.subido_por_usuario_id) await queryInterface.removeColumn('documentos', 'subido_por_usuario_id');
    if (docs.descripcion) await queryInterface.removeColumn('documentos', 'descripcion');
    const users = await queryInterface.describeTable('usuarios');
    if (users.rol) await queryInterface.removeColumn('usuarios', 'rol');
  },
};
