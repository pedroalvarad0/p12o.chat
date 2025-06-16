export const models = [
  "GPT-4o",
  "GPT-4.1",
  "Claude 3.5 Sonnet",
  "Claude 3.7 Sonnet",
  "Claude Sonnet 4",
  "Claude Opus 4",
  "DeepSeek R1",
  "Gemini 2.0 Flash",
  "Gemini 2.5 Flash",
  "Gemini 2.5 Pro",
  "Llama 3.3 70B"
]

const modelToOpenRouterMap: Record<string, string> = {
  "GPT-4o": "openai/gpt-4o",
  "GPT-4.1": "openai/gpt-4.1",
  "Claude Sonnet 4": "anthropic/claude-sonnet-4",
  "DeepSeek R1": "deepseek/deepseek-r1-0528:free",
  "Gemini 2.0 Flash": "google/gemini-2.0-flash-001",
  "Gemini 2.5 Flash": "google/gemini-2.5-flash-preview-05-20",
  "Gemini 2.5 Pro": "google/gemini-2.5-pro-preview",
  "Claude 3.7 Sonnet": "anthropic/claude-3.7-sonnet",
  "Llama 3.3 70B": "meta-llama/llama-3.3-70b-instruct",
  "Claude Opus 4": "anthropic/claude-opus-4",
  "Claude 3.5 Sonnet": "anthropic/claude-3.5-sonnet"
}


export function getOpenRouterModelName(modelName: string): string {
  const openRouterName = modelToOpenRouterMap[modelName]
  
  if (!openRouterName) {
    throw new Error(`Model not supported: ${modelName}`)
  }
  
  return openRouterName
}

export function getAllOpenRouterModels(): string[] {
  return models.map(model => getOpenRouterModelName(model))
}

