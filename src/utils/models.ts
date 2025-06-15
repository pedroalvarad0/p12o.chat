export const models = [
  "gpt-4o",
  "gpt-4.1",
  "gpt-4o-mini",
  "claude-sonnet-4",
  "deepseek-r1",
  "Gemini 2.0 Flash"
]

const modelToOpenRouterMap: Record<string, string> = {
  "gpt-4o": "openai/gpt-4o",
  "gpt-4.1": "openai/gpt-4.1",
  "gpt-4o-mini": "openai/gpt-4o-mini",
  "claude-sonnet-4": "anthropic/claude-sonnet-4",
  "deepseek-r1": "deepseek/deepseek-r1-0528:free",
  "Gemini 2.0 Flash": "google/gemini-2.0-flash-001"
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

