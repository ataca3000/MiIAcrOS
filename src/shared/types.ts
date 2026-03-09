/**
 * Shared type definitions used across Karen AI frontend and backend communication.
 */

/** AI model identifiers supported by Karen AI */
export type AIModel = 'gemini' | 'llama3' | 'mistral';

/** A single message in the conversation history */
export interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}

/** WebSocket command payload sent from frontend to backend */
export interface WSCommand {
  command: 'ejecutar_ai' | 'resumir_web' | 'copiar_a_word';
  params: Record<string, string>;
}

/** WebSocket response payload sent from backend to frontend */
export interface WSResponse {
  response: string;
  action?: {
    action: string;
    params: Record<string, string>;
  };
  resumen?: string;
}

/** Application configuration */
export interface KarenConfig {
  geminiApiKey?: string;
  selectedModel: AIModel;
  backendUrl: string;
}
