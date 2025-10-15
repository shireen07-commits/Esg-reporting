/**
 * Mock MCP LLM Service
 * 
 * Simulates Model Context Protocol LLM integration with
 * context-aware ESG responses based on technical documentation
 */

import { generateMockResponse, getSuggestedPromptsByContext } from '../../client/src/lib/sampleData';
import type { SessionContext, ChatResponse, IntentTypeEnum } from '@shared/schema';

interface LLMRequest {
  query: string;
  context: SessionContext;
  sessionHistory?: Array<{ role: string; content: string }>;
}

interface LLMResponse {
  text: string;
  confidence: number;
  intent: IntentTypeEnum;
  suggestedPrompts: string[];
  dataSources: string[];
}

/**
 * Mock MCP LLM call - simulates intelligent ESG responses
 * In production, this would call actual MCP protocol LLM service
 */
export async function callMcpLlm(request: LLMRequest): Promise<LLMResponse> {
  const { query, context } = request;
  
  // Simulate network latency for realistic demo
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
  
  // Generate context-aware response using sample data
  const response = generateMockResponse(query, {
    pageType: context.pageType,
    userRole: context.userRole,
    metricId: context.metricIds?.[0]
  });
  
  return {
    text: response.text,
    confidence: response.confidence,
    intent: response.intent as IntentTypeEnum,
    suggestedPrompts: response.suggestedPrompts,
    dataSources: response.dataSources
  };
}

/**
 * Enrich query context with user information and page state
 */
export function enrichContext(
  query: string,
  context: SessionContext,
  userRole: string,
  organizationName: string
): SessionContext {
  return {
    ...context,
    userRole: userRole as any,
    // Add additional enrichment based on query analysis
  };
}

/**
 * Detect query intent for routing and response formatting
 */
export function detectIntent(query: string): IntentTypeEnum {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('why') || lowerQuery.includes('explain') || lowerQuery.includes('what is')) {
    return 'explain';
  }
  if (lowerQuery.includes('summarize') || lowerQuery.includes('summary') || lowerQuery.includes('overview')) {
    return 'summarize';
  }
  if (lowerQuery.includes('how do i') || lowerQuery.includes('where') || lowerQuery.includes('navigate')) {
    return 'navigate';
  }
  if (lowerQuery.includes('help') || lowerQuery.includes('guide') || lowerQuery.includes('tutorial')) {
    return 'guide';
  }
  if (lowerQuery.includes('validate') || lowerQuery.includes('check') || lowerQuery.includes('verify')) {
    return 'validate';
  }
  
  return 'guide'; // default
}

/**
 * Format response with markdown and suggested actions
 */
export function formatResponse(
  llmResponse: LLMResponse,
  intent: IntentTypeEnum
): string {
  // Response is already well-formatted from mock generator
  return llmResponse.text;
}

/**
 * Stream response token by token (for WebSocket implementation)
 */
export async function* streamResponse(text: string): AsyncGenerator<string> {
  const words = text.split(' ');
  for (const word of words) {
    yield word + ' ';
    await new Promise(resolve => setTimeout(resolve, 30)); // 30ms between tokens
  }
}
