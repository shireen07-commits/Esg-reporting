/**
 * ESG Copilot API Routes
 * 
 * Implements REST API endpoints per technical documentation:
 * - POST /api/v1/copilot/chat - Send query and receive response
 * - GET /api/v1/copilot/sessions/:id - Retrieve conversation history
 * - WebSocket /ws - Real-time message streaming
 */

import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { verifyToken } from "./services/authService";
import { 
  callMcpLlm, 
  enrichContext, 
  detectIntent, 
  formatResponse,
  streamResponse 
} from "./services/mcpLlmService";
import { chatQueryRequestSchema, UserRole } from "@shared/schema";
import type { ChatQueryRequestType, ChatResponse } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Middleware to verify JWT token
  const authMiddleware = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    const payload = verifyToken(authHeader || '');
    
    if (!payload) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid or expired authentication token'
        }
      });
    }
    
    req.user = payload;
    next();
  };

  /**
   * POST /api/v1/copilot/chat
   * 
   * Send user query to ESG Copilot and receive context-aware response
   */
  app.post('/api/v1/copilot/chat', authMiddleware, async (req, res) => {
    try {
      const validationResult = chatQueryRequestSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({
          error: {
            code: 'INVALID_QUERY',
            message: 'Invalid request format',
            details: validationResult.error.issues
          }
        });
      }

      const queryRequest: ChatQueryRequestType = validationResult.data;
      const user = req.user;

      // 1. Get or create chat session
      let session;
      if (queryRequest.sessionId) {
        session = await storage.getChatSession(queryRequest.sessionId);
        if (!session || session.userId !== user.sub) {
          return res.status(404).json({
            error: {
              code: 'SESSION_NOT_FOUND',
              message: 'Chat session not found or access denied'
            }
          });
        }
      } else {
        // Create new session
        session = await storage.createChatSession({
          userId: user.sub,
          organizationId: user.org_id,
          context: queryRequest.context || {}
        });
      }

      // 2. Save user message
      const userMessage = await storage.createChatMessage({
        sessionId: session.id,
        role: 'user',
        content: queryRequest.query,
        intent: null,
        confidence: null,
        dataSources: null,
        suggestedPrompts: null,
        actions: null,
        metadata: null
      });

      // 3. Enrich context with user information
      const enrichedContext = enrichContext(
        queryRequest.query,
        queryRequest.context || {},
        user.role,
        'Acme Sustainability Corp' // From user's org
      );

      // 4. Detect intent
      const intent = detectIntent(queryRequest.query);

      // 5. Call mock MCP LLM service
      const llmResponse = await callMcpLlm({
        query: queryRequest.query,
        context: enrichedContext,
        sessionHistory: await storage.getMessagesBySessionId(session.id)
          .then(msgs => msgs.slice(-10).map(m => ({ role: m.role, content: m.content })))
      });

      // 6. Format and save assistant response
      const formattedText = formatResponse(llmResponse, intent);
      
      const assistantMessage = await storage.createChatMessage({
        sessionId: session.id,
        role: 'assistant',
        content: formattedText,
        intent: llmResponse.intent,
        confidence: Math.round(llmResponse.confidence * 100),
        dataSources: llmResponse.dataSources,
        suggestedPrompts: llmResponse.suggestedPrompts,
        actions: [],
        metadata: {
          tokensUsed: Math.floor(formattedText.length / 4),
          latencyMs: 1250,
          cached: false
        }
      });

      // 7. Build response
      const response: ChatResponse = {
        sessionId: session.id,
        messageId: assistantMessage.id,
        response: {
          text: formattedText,
          confidence: llmResponse.confidence,
          intent: llmResponse.intent,
          dataSources: llmResponse.dataSources,
          suggestedPrompts: llmResponse.suggestedPrompts,
          actions: []
        },
        metadata: {
          tokensUsed: assistantMessage.metadata?.tokensUsed,
          latencyMs: assistantMessage.metadata?.latencyMs,
          cached: assistantMessage.metadata?.cached
        },
        timestamp: assistantMessage.timestamp.toISOString()
      };

      res.json(response);
    } catch (error) {
      console.error('Chat endpoint error:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred processing your query'
        }
      });
    }
  });

  /**
   * GET /api/v1/copilot/sessions/:id
   * 
   * Retrieve conversation history for a chat session
   */
  app.get('/api/v1/copilot/sessions/:id', authMiddleware, async (req, res) => {
    try {
      const sessionId = req.params.id;
      const user = req.user;

      const session = await storage.getChatSession(sessionId);
      
      if (!session) {
        return res.status(404).json({
          error: {
            code: 'SESSION_NOT_FOUND',
            message: 'Chat session not found'
          }
        });
      }

      if (session.userId !== user.sub) {
        return res.status(403).json({
          error: {
            code: 'ACCESS_DENIED',
            message: 'You do not have access to this session'
          }
        });
      }

      const messages = await storage.getMessagesBySessionId(sessionId);

      res.json({
        sessionId: session.id,
        userId: session.userId,
        createdAt: session.createdAt.toISOString(),
        lastActivity: session.lastActivity.toISOString(),
        messageCount: session.messageCount,
        messages: messages.map(msg => ({
          messageId: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp.toISOString(),
          intent: msg.intent,
          confidence: msg.confidence,
          suggestedPrompts: msg.suggestedPrompts,
          actions: msg.actions
        }))
      });
    } catch (error) {
      console.error('Session endpoint error:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred retrieving the session'
        }
      });
    }
  });

  /**
   * GET /api/v1/copilot/sessions
   * 
   * List all sessions for the authenticated user
   */
  app.get('/api/v1/copilot/sessions', authMiddleware, async (req, res) => {
    try {
      const user = req.user;
      const sessions = await storage.getSessionsByUserId(user.sub);

      res.json({
        sessions: sessions.map(s => ({
          sessionId: s.id,
          createdAt: s.createdAt.toISOString(),
          lastActivity: s.lastActivity.toISOString(),
          messageCount: s.messageCount,
          context: s.context
        }))
      });
    } catch (error) {
      console.error('Sessions list error:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred retrieving sessions'
        }
      });
    }
  });

  /**
   * WebSocket Server for Real-time Message Streaming
   * 
   * Path: /ws
   * Provides token-by-token streaming of LLM responses
   */
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket, req) => {
    console.log('WebSocket client connected');

    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        if (message.type === 'chat_query') {
          const { sessionId, query, context, token } = message;
          
          // Verify token
          const user = verifyToken(token);
          if (!user) {
            ws.send(JSON.stringify({
              type: 'error',
              error: { code: 'UNAUTHORIZED', message: 'Invalid token' }
            }));
            return;
          }

          // Send typing indicator
          ws.send(JSON.stringify({
            type: 'typing',
            sessionId
          }));

          // Process query (similar to REST endpoint)
          let session = sessionId ? await storage.getChatSession(sessionId) : null;
          if (!session) {
            session = await storage.createChatSession({
              userId: user.sub,
              organizationId: user.org_id,
              context: context || {}
            });
          }

          await storage.createChatMessage({
            sessionId: session.id,
            role: 'user',
            content: query,
            intent: null,
            confidence: null,
            dataSources: null,
            suggestedPrompts: null,
            actions: null,
            metadata: null
          });

          const enrichedContext = enrichContext(query, context || {}, user.role, 'Acme Sustainability Corp');
          const intent = detectIntent(query);
          const llmResponse = await callMcpLlm({
            query,
            context: enrichedContext,
            sessionHistory: []
          });

          const formattedText = formatResponse(llmResponse, intent);

          // Stream response token by token
          for await (const token of streamResponse(formattedText)) {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({
                type: 'token',
                sessionId: session.id,
                text: token
              }));
            }
          }

          // Save complete response
          const assistantMessage = await storage.createChatMessage({
            sessionId: session.id,
            role: 'assistant',
            content: formattedText,
            intent: llmResponse.intent,
            confidence: Math.round(llmResponse.confidence * 100),
            dataSources: llmResponse.dataSources,
            suggestedPrompts: llmResponse.suggestedPrompts,
            actions: [],
            metadata: { tokensUsed: Math.floor(formattedText.length / 4), latencyMs: 1250, cached: false }
          });

          // Send completion event
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
              type: 'complete',
              sessionId: session.id,
              messageId: assistantMessage.id,
              suggestedPrompts: llmResponse.suggestedPrompts,
              metadata: assistantMessage.metadata
            }));
          }
        }
      } catch (error) {
        console.error('WebSocket error:', error);
        ws.send(JSON.stringify({
          type: 'error',
          error: { code: 'INTERNAL_ERROR', message: 'An error occurred' }
        }));
      }
    });

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });

  return httpServer;
}
