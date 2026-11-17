'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex('movimientos', ['espacio_financiero_id', 'estado', 'fecha'], {
      name: 'idx_movimientos_balance',
    });

    await queryInterface.addIndex('movimientos', ['cuenta_origen_id', 'fecha'], {
      name: 'idx_movimientos_cuenta_origen_fecha',
    });

    await queryInterface.addIndex('movimientos', ['cuenta_destino_id', 'fecha'], {
      name: 'idx_movimientos_cuenta_destino_fecha',
    });

    await queryInterface.addIndex('fragmentos', ['documento_version_id', 'indice'], {
      name: 'idx_fragmentos_version_indice',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('fragmentos', 'idx_fragmentos_version_indice');
    await queryInterface.removeIndex('movimientos', 'idx_movimientos_cuenta_destino_fecha');
    await queryInterface.removeIndex('movimientos', 'idx_movimientos_cuenta_origen_fecha');
    await queryInterface.removeIndex('movimientos', 'idx_movimientos_balance');
  },
};
