
/**
 * Configuration for external services.
 * Fill in your Qwen API key below to enable the translation features.
 */
export const CONFIG = {
  QWEN: {
    // This is an OpenRouter key (sk-or-v1...)
    API_KEY: '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',
    // Correct base URL for OpenRouter
    BASE_URL: 'https://openrouter.ai/api/v1',
    // Correct model identifier for OpenRouter (Alibaba Qwen models)
    MODEL: 'qwen/qwen-turbo' 
  }
};
