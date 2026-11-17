export class LlmProvider {
  async generate() {
    throw new Error('LLM provider is not configured');
  }
}
