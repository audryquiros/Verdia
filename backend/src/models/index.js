import { sequelize } from '../config/database.js';
import { initUsuario } from './Usuario.js';
import { initSesion } from './Sesion.js';
import { initEspacioFinanciero } from './EspacioFinanciero.js';
import { initCuenta } from './Cuenta.js';
import { initTarjeta } from './Tarjeta.js';
import { initCategoria } from './Categoria.js';
import { initTipoCambio } from './TipoCambio.js';
import { initDeuda } from './Deuda.js';
import { initMeta } from './Meta.js';
import { initMovimiento } from './Movimiento.js';
import { initPresupuesto } from './Presupuesto.js';
import { initConversacion } from './Conversacion.js';
import { initMensaje } from './Mensaje.js';
import { initFuenteMensaje } from './FuenteMensaje.js';
import { initPropuestaVera } from './PropuestaVera.js';
import { initDocumento } from './Documento.js';
import { initDocumentoVersion } from './DocumentoVersion.js';
import { initFragmento } from './Fragmento.js';
import { initOrganizacion } from './Organizacion.js';
import { initRol } from './Rol.js';
import { initMembresia } from './Membresia.js';
import { initPolitica } from './Politica.js';
import { initPoliticaVersion } from './PoliticaVersion.js';
import { initAuditoria } from './Auditoria.js';
import { initEvento } from './Evento.js';
import { initCasoSoporte } from './CasoSoporte.js';
import { initMensajeSoporte } from './MensajeSoporte.js';

const db = {
  Usuario: initUsuario(sequelize),
  Sesion: initSesion(sequelize),
  EspacioFinanciero: initEspacioFinanciero(sequelize),
  Cuenta: initCuenta(sequelize),
  Tarjeta: initTarjeta(sequelize),
  Categoria: initCategoria(sequelize),
  TipoCambio: initTipoCambio(sequelize),
  Deuda: initDeuda(sequelize),
  Meta: initMeta(sequelize),
  Movimiento: initMovimiento(sequelize),
  Presupuesto: initPresupuesto(sequelize),
  Conversacion: initConversacion(sequelize),
  Mensaje: initMensaje(sequelize),
  FuenteMensaje: initFuenteMensaje(sequelize),
  PropuestaVera: initPropuestaVera(sequelize),
  Documento: initDocumento(sequelize),
  DocumentoVersion: initDocumentoVersion(sequelize),
  Fragmento: initFragmento(sequelize),
  Organizacion: initOrganizacion(sequelize),
  Rol: initRol(sequelize),
  Membresia: initMembresia(sequelize),
  Politica: initPolitica(sequelize),
  PoliticaVersion: initPoliticaVersion(sequelize),
  Auditoria: initAuditoria(sequelize),
  Evento: initEvento(sequelize),
  CasoSoporte: initCasoSoporte(sequelize),
  MensajeSoporte: initMensajeSoporte(sequelize),
  sequelize,
};

const {
  Usuario, Sesion, EspacioFinanciero, Cuenta, Tarjeta, Categoria,
  TipoCambio, Deuda, Meta, Movimiento, Presupuesto, Conversacion,
  Mensaje, FuenteMensaje, PropuestaVera, Documento, DocumentoVersion,
  Fragmento, Organizacion, Rol, Membresia, Politica, PoliticaVersion,
  Auditoria, CasoSoporte, MensajeSoporte,
} = db;

Usuario.hasMany(Sesion, { foreignKey: 'usuario_id' });
Sesion.belongsTo(Usuario, { foreignKey: 'usuario_id' });
Usuario.hasMany(EspacioFinanciero, { foreignKey: 'usuario_id' });
EspacioFinanciero.belongsTo(Usuario, { foreignKey: 'usuario_id' });
EspacioFinanciero.hasMany(Cuenta, { foreignKey: 'espacio_financiero_id' });
Cuenta.belongsTo(EspacioFinanciero, { foreignKey: 'espacio_financiero_id' });
EspacioFinanciero.hasMany(Tarjeta, { foreignKey: 'espacio_financiero_id' });
Tarjeta.belongsTo(EspacioFinanciero, { foreignKey: 'espacio_financiero_id' });
Cuenta.hasMany(Tarjeta, { foreignKey: 'cuenta_id' });
Tarjeta.belongsTo(Cuenta, { foreignKey: 'cuenta_id' });
EspacioFinanciero.hasMany(Categoria, { foreignKey: 'espacio_financiero_id' });
Categoria.belongsTo(EspacioFinanciero, { foreignKey: 'espacio_financiero_id' });
Categoria.belongsTo(Categoria, { as: 'padre', foreignKey: 'categoria_padre_id' });
Categoria.hasMany(Categoria, { as: 'hijas', foreignKey: 'categoria_padre_id' });
EspacioFinanciero.hasMany(Deuda, { foreignKey: 'espacio_financiero_id' });
Deuda.belongsTo(EspacioFinanciero, { foreignKey: 'espacio_financiero_id' });
EspacioFinanciero.hasMany(Meta, { foreignKey: 'espacio_financiero_id' });
Meta.belongsTo(EspacioFinanciero, { foreignKey: 'espacio_financiero_id' });
EspacioFinanciero.hasMany(Movimiento, { foreignKey: 'espacio_financiero_id' });
Movimiento.belongsTo(EspacioFinanciero, { foreignKey: 'espacio_financiero_id' });
Cuenta.hasMany(Movimiento, { as: 'movimientosOrigen', foreignKey: 'cuenta_origen_id' });
Cuenta.hasMany(Movimiento, { as: 'movimientosDestino', foreignKey: 'cuenta_destino_id' });
Movimiento.belongsTo(Cuenta, { as: 'cuentaOrigen', foreignKey: 'cuenta_origen_id' });
Movimiento.belongsTo(Cuenta, { as: 'cuentaDestino', foreignKey: 'cuenta_destino_id' });
Tarjeta.hasMany(Movimiento, { foreignKey: 'tarjeta_id' });
Movimiento.belongsTo(Tarjeta, { foreignKey: 'tarjeta_id' });
Deuda.hasMany(Movimiento, { foreignKey: 'deuda_id' });
Movimiento.belongsTo(Deuda, { foreignKey: 'deuda_id' });
Categoria.hasMany(Movimiento, { foreignKey: 'categoria_id' });
Movimiento.belongsTo(Categoria, { foreignKey: 'categoria_id' });
TipoCambio.hasMany(Movimiento, { foreignKey: 'tipo_cambio_id' });
Movimiento.belongsTo(TipoCambio, { foreignKey: 'tipo_cambio_id' });
Movimiento.belongsTo(Documento, { foreignKey: 'documento_id' });
Movimiento.belongsTo(Movimiento, { as: 'movimientoOrigen', foreignKey: 'movimiento_origen_id' });
Movimiento.belongsTo(Movimiento, { as: 'correccionDe', foreignKey: 'correccion_de_id' });
EspacioFinanciero.hasMany(Presupuesto, { foreignKey: 'espacio_financiero_id' });
Presupuesto.belongsTo(EspacioFinanciero, { foreignKey: 'espacio_financiero_id' });
Categoria.hasMany(Presupuesto, { foreignKey: 'categoria_id' });
Presupuesto.belongsTo(Categoria, { foreignKey: 'categoria_id' });
Usuario.hasMany(Conversacion, { foreignKey: 'usuario_id' });
Conversacion.belongsTo(Usuario, { foreignKey: 'usuario_id' });
Conversacion.hasMany(Mensaje, { foreignKey: 'conversacion_id' });
Mensaje.belongsTo(Conversacion, { foreignKey: 'conversacion_id' });
Mensaje.hasMany(FuenteMensaje, { foreignKey: 'mensaje_id' });
FuenteMensaje.belongsTo(Mensaje, { foreignKey: 'mensaje_id' });
Mensaje.hasMany(PropuestaVera, { foreignKey: 'mensaje_id' });
PropuestaVera.belongsTo(Mensaje, { foreignKey: 'mensaje_id' });
Usuario.hasMany(PropuestaVera, { as: 'propuestasConfirmadas', foreignKey: 'confirmada_por_usuario_id' });
PropuestaVera.belongsTo(Usuario, { as: 'confirmadaPor', foreignKey: 'confirmada_por_usuario_id' });
Documento.hasMany(DocumentoVersion, { foreignKey: 'documento_id' });
DocumentoVersion.belongsTo(Documento, { foreignKey: 'documento_id' });
DocumentoVersion.hasMany(Fragmento, { foreignKey: 'documento_version_id' });
Fragmento.belongsTo(DocumentoVersion, { foreignKey: 'documento_version_id' });
FuenteMensaje.belongsTo(DocumentoVersion, { foreignKey: 'documento_version_id' });
DocumentoVersion.hasMany(FuenteMensaje, { foreignKey: 'documento_version_id' });
Documento.hasMany(Movimiento, { foreignKey: 'documento_id' });
Organizacion.hasMany(Rol, { foreignKey: 'organizacion_id' });
Rol.belongsTo(Organizacion, { foreignKey: 'organizacion_id' });
Organizacion.hasMany(Membresia, { foreignKey: 'organizacion_id' });
Membresia.belongsTo(Organizacion, { foreignKey: 'organizacion_id' });
Usuario.hasMany(Membresia, { foreignKey: 'usuario_id' });
Membresia.belongsTo(Usuario, { foreignKey: 'usuario_id' });
Rol.hasMany(Membresia, { foreignKey: 'rol_id' });
Membresia.belongsTo(Rol, { foreignKey: 'rol_id' });
Organizacion.hasMany(Politica, { foreignKey: 'organizacion_id' });
Politica.belongsTo(Organizacion, { foreignKey: 'organizacion_id' });
Politica.hasMany(PoliticaVersion, { foreignKey: 'politica_id' });
PoliticaVersion.belongsTo(Politica, { foreignKey: 'politica_id' });
PoliticaVersion.belongsTo(DocumentoVersion, { foreignKey: 'documento_version_id' });
DocumentoVersion.hasMany(PoliticaVersion, { foreignKey: 'documento_version_id' });
Usuario.hasMany(Auditoria, { foreignKey: 'usuario_id' });
Auditoria.belongsTo(Usuario, { foreignKey: 'usuario_id' });
Usuario.hasMany(CasoSoporte, { foreignKey: 'usuario_id' });
CasoSoporte.belongsTo(Usuario, { as: 'usuario', foreignKey: 'usuario_id' });
Usuario.hasMany(CasoSoporte, { as: 'casosAsignados', foreignKey: 'asignado_a_usuario_id' });
CasoSoporte.belongsTo(Usuario, { as: 'asignadoA', foreignKey: 'asignado_a_usuario_id' });
CasoSoporte.hasMany(MensajeSoporte, { foreignKey: 'caso_soporte_id' });
MensajeSoporte.belongsTo(CasoSoporte, { foreignKey: 'caso_soporte_id' });
MensajeSoporte.belongsTo(Usuario, { as: 'autor', foreignKey: 'autor_usuario_id' });

export default db;
export { sequelize };
