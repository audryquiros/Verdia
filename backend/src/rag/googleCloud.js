/**
 * Adaptador de infraestructura RAG para Google Cloud.
 *
 * Mantiene la aplicación desacoplada de un servicio concreto de Google Cloud
 * hasta cerrar la configuración técnica del proyecto.
 */
export class GoogleCloudRagProvider {
  constructor(config = {}) {
    this.config = config;
  }

  async indexDocument() {
    throw new Error('Google Cloud RAG provider is not configured yet');
  }

  async retrieve() {
    throw new Error('Google Cloud RAG provider is not configured yet');
  }

  async generateAnswer() {
    throw new Error('Google Cloud LLM provider is not configured yet');
  }
}
