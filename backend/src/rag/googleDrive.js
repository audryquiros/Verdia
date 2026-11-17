/**
 * Punto de integración para Google Drive.
 *
 * Responsabilidad:
 * - localizar archivos autorizados;
 * - detectar archivos nuevos o modificados;
 * - obtener metadata;
 * - entregar el contenido al pipeline RAG.
 *
 * La autenticación y cliente oficial de Google se implementarán
 * al configurar el proyecto Google Cloud y sus credenciales.
 */
export class GoogleDriveSource {
  constructor(config = {}) {
    this.config = config;
  }

  async listAuthorizedFiles() {
    throw new Error('Google Drive integration is not configured yet');
  }

  async getFileContent() {
    throw new Error('Google Drive integration is not configured yet');
  }
}
