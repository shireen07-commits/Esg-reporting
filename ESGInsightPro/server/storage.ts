/**
 * ESG Copilot Storage Interface
 * 
 * In-memory storage for chat sessions, messages, user contexts,
 * and ESG data following the technical documentation architecture
 */

import { randomUUID } from "crypto";
import type { 
  ChatSession, 
  InsertChatSession,
  ChatMessage,
  InsertChatMessage,
  UserContext,
  InsertUserContext,
  ESGDataContext
} from "@shared/schema";

export interface IStorage {
  // Chat Session Management
  getChatSession(id: string): Promise<ChatSession | undefined>;
  getSessionsByUserId(userId: string): Promise<ChatSession[]>;
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  updateSessionActivity(id: string): Promise<void>;
  
  // Chat Messages
  getChatMessage(id: string): Promise<ChatMessage | undefined>;
  getMessagesBySessionId(sessionId: string): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // User Context
  getUserContext(userId: string): Promise<UserContext | undefined>;
  createUserContext(context: InsertUserContext): Promise<UserContext>;
  updateUserContext(userId: string, context: Partial<UserContext>): Promise<UserContext>;
  
  // ESG Data Context
  getESGDataContext(id: string): Promise<ESGDataContext | undefined>;
  getESGDataByType(type: string): Promise<ESGDataContext[]>;
  getESGDataByMetricId(metricId: string): Promise<ESGDataContext[]>;
}

export class MemStorage implements IStorage {
  private chatSessions: Map<string, ChatSession>;
  private chatMessages: Map<string, ChatMessage>;
  private userContexts: Map<string, UserContext>;
  private esgDataContexts: Map<string, ESGDataContext>;

  constructor() {
    this.chatSessions = new Map();
    this.chatMessages = new Map();
    this.userContexts = new Map();
    this.esgDataContexts = new Map();
  }

  // Chat Session Methods
  async getChatSession(id: string): Promise<ChatSession | undefined> {
    return this.chatSessions.get(id);
  }

  async getSessionsByUserId(userId: string): Promise<ChatSession[]> {
    return Array.from(this.chatSessions.values()).filter(
      (session) => session.userId === userId
    );
  }

  async createChatSession(insertSession: InsertChatSession): Promise<ChatSession> {
    const id = randomUUID();
    const now = new Date();
    const session: ChatSession = {
      id,
      ...insertSession,
      createdAt: now,
      lastActivity: now,
      messageCount: 0,
    };
    this.chatSessions.set(id, session);
    return session;
  }

  async updateSessionActivity(id: string): Promise<void> {
    const session = this.chatSessions.get(id);
    if (session) {
      session.lastActivity = new Date();
      session.messageCount += 1;
      this.chatSessions.set(id, session);
    }
  }

  // Chat Message Methods
  async getChatMessage(id: string): Promise<ChatMessage | undefined> {
    return this.chatMessages.get(id);
  }

  async getMessagesBySessionId(sessionId: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter((message) => message.sessionId === sessionId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = {
      id,
      ...insertMessage,
      timestamp: new Date(),
    };
    this.chatMessages.set(id, message);
    
    // Update session activity
    await this.updateSessionActivity(insertMessage.sessionId);
    
    return message;
  }

  // User Context Methods
  async getUserContext(userId: string): Promise<UserContext | undefined> {
    return this.userContexts.get(userId);
  }

  async createUserContext(insertContext: InsertUserContext): Promise<UserContext> {
    const id = randomUUID();
    const now = new Date();
    const context: UserContext = {
      id,
      ...insertContext,
      createdAt: now,
      updatedAt: now,
    };
    this.userContexts.set(insertContext.userId, context);
    return context;
  }

  async updateUserContext(
    userId: string, 
    updates: Partial<UserContext>
  ): Promise<UserContext> {
    const existing = this.userContexts.get(userId);
    if (!existing) {
      throw new Error(`User context not found for userId: ${userId}`);
    }
    
    const updated: UserContext = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.userContexts.set(userId, updated);
    return updated;
  }

  // ESG Data Context Methods
  async getESGDataContext(id: string): Promise<ESGDataContext | undefined> {
    return this.esgDataContexts.get(id);
  }

  async getESGDataByType(type: string): Promise<ESGDataContext[]> {
    return Array.from(this.esgDataContexts.values()).filter(
      (context) => context.type === type
    );
  }

  async getESGDataByMetricId(metricId: string): Promise<ESGDataContext[]> {
    return Array.from(this.esgDataContexts.values()).filter(
      (context) => context.metricId === metricId
    );
  }
}

export const storage = new MemStorage();
