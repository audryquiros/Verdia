import { LlmProvider } from './llmProvider.js';

export function createLlmProvider() {
  // Provider-neutral por ahora. Cuando definamos el proveedor,
  // se agrega su adaptador sin cambiar el servicio RAG.
  return new LlmProvider();
}
