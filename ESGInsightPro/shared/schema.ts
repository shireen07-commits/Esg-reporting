import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

/**
 * ESG Copilot MVP - Data Schema
 * 
 * Architecture: Follows technical documentation for chat sessions,
 * messages, user context, and ESG-specific data models.
 */

// User Roles enum for ESG context
export const UserRole = {
  ANALYST: 'ESG_ANALYST',
  AUDITOR: 'AUDITOR',
  SUPPLIER: 'SUPPLIER',
  MANAGER: 'SUSTAINABILITY_MANAGER',
} as const;

export type UserRoleType = typeof UserRole[keyof typeof UserRole];

// Page Types for context-aware responses
export const PageType = {
  DASHBOARD: 'dashboard',
  REPORT: 'report',
  DATA_ENTRY: 'data_entry',
  AUDIT: 'audit',
  SETTINGS: 'settings',
} as const;

export type PageTypeEnum = typeof PageType[keyof typeof PageType];

// Intent Types for query routing
export const IntentType = {
  EXPLAIN: 'explain',
  SUMMARIZE: 'summarize',
  NAVIGATE: 'navigate',
  GUIDE: 'guide',
  VALIDATE: 'validate',
} as const;

export type IntentTypeEnum = typeof IntentType[keyof typeof IntentType];

// Chat Sessions - manages conversation context
export const chatSessions = pgTable("chat_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  organizationId: varchar("organization_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastActivity: timestamp("last_activity").notNull().defaultNow(),
  messageCount: integer("message_count").notNull().default(0),
  context: jsonb("context").$type<SessionContext>(),
});

// Chat Messages - stores conversation history
export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull(),
  role: varchar("role").notNull(), // 'user' | 'assistant'
  content: text("content").notNull(),
  intent: varchar("intent"),
  confidence: integer("confidence"), // 0-100
  dataSources: jsonb("data_sources").$type<string[]>(),
  suggestedPrompts: jsonb("suggested_prompts").$type<string[]>(),
  actions: jsonb("actions").$type<ActionItem[]>(),
  metadata: jsonb("metadata").$type<MessageMetadata>(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

// User Context - enriched user information
export const userContexts = pgTable("user_contexts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique(),
  role: varchar("role").notNull().$type<UserRoleType>(),
  organizationId: varchar("organization_id").notNull(),
  organizationName: varchar("organization_name").notNull(),
  permissions: jsonb("permissions").$type<string[]>(),
  dataScope: jsonb("data_scope").$type<DataScope>(),
  preferences: jsonb("preferences").$type<UserPreferences>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ESG Data Context - sample emission and anomaly data
export const esgDataContexts = pgTable("esg_data_contexts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: varchar("type").notNull(), // 'emission' | 'anomaly' | 'audit' | 'compliance'
  entityId: varchar("entity_id"),
  metricId: varchar("metric_id"),
  data: jsonb("data").$type<ESGDataContent>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// TypeScript interfaces for JSONB fields
export interface SessionContext {
  page?: string;
  pageType?: PageTypeEnum;
  entityIds?: string[];
  metricIds?: string[];
  reportId?: string;
  userAction?: string;
  userRole?: UserRoleType;
}

export interface ActionItem {
  type: 'navigation' | 'data_action' | 'report_action';
  label: string;
  url?: string;
  apiCall?: {
    method: string;
    endpoint: string;
    payload?: Record<string, any>;
  };
}

export interface MessageMetadata {
  tokensUsed?: number;
  latencyMs?: number;
  cached?: boolean;
}

export interface DataScope {
  entities?: string[];
  geographies?: string[];
}

export interface UserPreferences {
  language?: string;
  timezone?: string;
  notifications?: boolean;
}

export interface ESGDataContent {
  value?: number;
  historicalAvg?: number;
  anomalyScore?: number;
  confidence?: number;
  flagReason?: string;
  impactLevel?: 'low' | 'medium' | 'high' | 'critical';
  facility?: string;
  geography?: string;
  timestamp?: string;
  [key: string]: any;
}

// Chat Query Request/Response types
export interface ChatQueryRequest {
  sessionId?: string;
  query: string;
  context?: SessionContext;
  options?: {
    streaming?: boolean;
    includeSuggestions?: boolean;
    maxTokens?: number;
  };
}

export interface ChatResponse {
  sessionId: string;
  messageId: string;
  response: {
    text: string;
    confidence: number;
    intent: IntentTypeEnum;
    dataSources: string[];
    suggestedPrompts: string[];
    actions: ActionItem[];
  };
  metadata: MessageMetadata;
  timestamp: string;
}

// Zod schemas for validation
export const insertChatSessionSchema = createInsertSchema(chatSessions).omit({
  id: true,
  createdAt: true,
  lastActivity: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  timestamp: true,
});

export const insertUserContextSchema = createInsertSchema(userContexts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const chatQueryRequestSchema = z.object({
  sessionId: z.string().optional(),
  query: z.string().min(1).max(2000),
  context: z.object({
    page: z.string().optional(),
    pageType: z.enum(['dashboard', 'report', 'data_entry', 'audit', 'settings']).optional(),
    entityIds: z.array(z.string()).optional(),
    metricIds: z.array(z.string()).optional(),
    reportId: z.string().optional(),
    userAction: z.string().optional(),
  }).optional(),
  options: z.object({
    streaming: z.boolean().optional(),
    includeSuggestions: z.boolean().optional(),
    maxTokens: z.number().optional(),
  }).optional(),
});

// Type exports
export type InsertChatSession = z.infer<typeof insertChatSessionSchema>;
export type ChatSession = typeof chatSessions.$inferSelect;

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

export type InsertUserContext = z.infer<typeof insertUserContextSchema>;
export type UserContext = typeof userContexts.$inferSelect;

export type ESGDataContext = typeof esgDataContexts.$inferSelect;
export type ChatQueryRequestType = z.infer<typeof chatQueryRequestSchema>;
