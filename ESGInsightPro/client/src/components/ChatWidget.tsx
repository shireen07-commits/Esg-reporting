/**
 * ESG Copilot Chat Widget
 * 
 * Collapsible chat interface with real-time streaming responses,
 * context-aware suggestions, and rich content rendering.
 * 
 * Architecture: Follows MCP LLM integration patterns from technical docs
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, X, Minimize2, Send, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { useWebSocketChat } from '@/hooks/useChatApi';
import { useToast } from '@/hooks/use-toast';
import type { ChatMessage, UserRoleType, ActionItem } from '@shared/schema';

interface ChatWidgetProps {
  userRole: UserRoleType;
  userId: string;
  organizationName: string;
  currentPage?: string;
  pageType?: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  suggestedPrompts?: string[];
  actions?: ActionItem[];
  confidence?: number;
  timestamp: Date;
}

export function ChatWidget({ 
  userRole, 
  userId,
  organizationName,
  currentPage = '/',
  pageType = 'dashboard'
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const streamingMessageRef = useRef<string>('');
  
  const { toast } = useToast();
  const { connectWebSocket, sendMessage } = useWebSocketChat();

  // WebSocket message handler (stable reference)
  const handleWebSocketMessage = useCallback((data: any) => {
    if (data.type === 'typing') {
      setIsTyping(true);
      streamingMessageRef.current = '';
    } else if (data.type === 'token') {
      // Append streaming token
      streamingMessageRef.current += data.text;
      
      // Update the last message if it exists and is from assistant
      setMessages(prev => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg && lastMsg.role === 'assistant' && lastMsg.id.startsWith('streaming-')) {
          return [
            ...prev.slice(0, -1),
            { ...lastMsg, content: streamingMessageRef.current }
          ];
        } else {
          // Create new streaming message
          return [
            ...prev,
            {
              id: `streaming-${data.sessionId}`,
              role: 'assistant' as const,
              content: streamingMessageRef.current,
              timestamp: new Date()
            }
          ];
        }
      });
    } else if (data.type === 'complete') {
      setIsTyping(false);
      setSessionId(prev => prev || data.sessionId);
      
      // Update final message with metadata
      setMessages(prev => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg && lastMsg.role === 'assistant') {
          return [
            ...prev.slice(0, -1),
            {
              ...lastMsg,
              id: data.messageId,
              suggestedPrompts: data.suggestedPrompts || [],
              confidence: data.metadata?.confidence
            }
          ];
        }
        return prev;
      });
    } else if (data.type === 'error') {
      setIsTyping(false);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: data.error?.message || 'An error occurred',
      });
    }
  }, [toast]);

  // WebSocket close handler with reconnection
  const handleWebSocketClose = useCallback(() => {
    wsRef.current = null;
    
    // Reconnect if widget is still open
    if (isOpen) {
      console.log('Reconnecting WebSocket...');
      setTimeout(() => {
        if (isOpen && !wsRef.current) {
          wsRef.current = connectWebSocket(handleWebSocketMessage, handleWebSocketClose);
        }
      }, 1000); // 1 second reconnection delay
    }
  }, [isOpen, connectWebSocket, handleWebSocketMessage]);

  // WebSocket connection setup
  useEffect(() => {
    if (isOpen && !wsRef.current) {
      wsRef.current = connectWebSocket(handleWebSocketMessage, handleWebSocketClose);
    }

    return () => {
      if (!isOpen && wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [isOpen, connectWebSocket, handleWebSocketMessage, handleWebSocketClose]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Context-aware suggested prompts based on page type
  const getSuggestedPrompts = () => {
    const prompts: Record<string, string[]> = {
      dashboard: [
        "Summarize this dashboard",
        "What changed since last month?",
        "Which metrics need attention?"
      ],
      data_entry: [
        "How do I upload emissions data?",
        "What file format should I use?",
        "Explain data quality scores"
      ],
      audit: [
        "Show me the audit trail",
        "Who approved this data?",
        "Explain the data lineage"
      ],
      report: [
        "Which template should I choose?",
        "What data is required?",
        "How long does generation take?"
      ],
      default: [
        "What is CSRD compliance?",
        "Explain anomaly detection",
        "How do I get started?"
      ]
    };
    
    return prompts[pageType] || prompts.default;
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const queryText = input;
    setInput('');
    
    // Send via WebSocket for streaming response
    if (wsRef.current) {
      sendMessage(wsRef.current, sessionId, queryText, {
        page: currentPage,
        pageType: pageType as any,
        userAction: 'query'
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Connection Error',
        description: 'WebSocket connection not established. Please refresh the page.',
      });
    }
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <Button
        size="icon"
        data-testid="button-open-chat"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-br from-ai-purple to-primary shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
        onClick={() => setIsOpen(true)}
      >
        <Sparkles className="h-6 w-6 text-white" />
      </Button>
    );
  }

  return (
    <Card 
      data-testid="chat-widget"
      className={cn(
        "fixed bottom-6 right-6 w-96 shadow-2xl border-border chat-expand",
        isMinimized ? "h-16" : "h-[600px]",
        "flex flex-col overflow-hidden transition-all duration-300"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-ai-purple/90 to-primary/90 text-white">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5" />
          <div>
            <h3 className="font-semibold text-sm" data-testid="text-chat-title">ESG Copilot</h3>
            <div className="flex items-center gap-2 text-xs opacity-90">
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              <span data-testid="text-session-status">Active Session</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Badge variant="secondary" className="text-xs" data-testid="badge-user-role">
            {userRole.replace('_', ' ')}
          </Badge>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-white hover:bg-white/20"
            data-testid="button-minimize-chat"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-white hover:bg-white/20"
            data-testid="button-close-chat"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      {!isMinimized && (
        <>
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8" data-testid="empty-state-chat">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-50" />
                  <h4 className="text-sm font-medium text-foreground mb-2">Welcome to ESG Copilot</h4>
                  <p className="text-xs text-muted-foreground mb-4">
                    Ask me about compliance, data validation, or platform features
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {getSuggestedPrompts().map((prompt, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        data-testid={`button-suggested-prompt-${idx}`}
                        onClick={() => handlePromptClick(prompt)}
                      >
                        {prompt}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  data-testid={`message-${message.role}-${message.id}`}
                  className={cn(
                    "flex gap-3 message-fade-in",
                    message.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-ai-purple to-primary flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2.5",
                      message.role === 'user'
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border"
                    )}
                  >
                    {message.role === 'assistant' ? (
                      <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none">
                        {message.content}
                      </ReactMarkdown>
                    ) : (
                      <p className="text-sm">{message.content}</p>
                    )}
                    
                    {message.suggestedPrompts && message.suggestedPrompts.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border/50 space-y-1">
                        <p className="text-xs text-muted-foreground mb-2">Suggested follow-ups:</p>
                        {message.suggestedPrompts.map((prompt, idx) => (
                          <Button
                            key={idx}
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-xs h-auto py-1.5"
                            data-testid={`button-follow-up-${idx}`}
                            onClick={() => handlePromptClick(prompt)}
                          >
                            {prompt}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 justify-start" data-testid="typing-indicator">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-ai-purple to-primary flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-card border border-border rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="h-2 w-2 rounded-full bg-muted-foreground typing-dot" />
                      <div className="h-2 w-2 rounded-full bg-muted-foreground typing-dot" />
                      <div className="h-2 w-2 rounded-full bg-muted-foreground typing-dot" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t bg-card">
            {messages.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {getSuggestedPrompts().map((prompt, idx) => (
                  <button
                    key={idx}
                    data-testid={`chip-suggested-${idx}`}
                    className="text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground hover-elevate transition-colors"
                    onClick={() => handlePromptClick(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about compliance, data, or features..."
                data-testid="input-chat-message"
                className="min-h-[44px] max-h-32 resize-none text-sm"
                rows={1}
              />
              <Button
                size="icon"
                disabled={!input.trim() || isTyping}
                data-testid="button-send-message"
                onClick={handleSend}
                className="h-11 w-11 flex-shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center" data-testid="text-chat-footer">
              {organizationName} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </>
      )}
    </Card>
  );
}
