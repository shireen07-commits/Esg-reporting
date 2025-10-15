/**
 * Chat API Hook
 * 
 * Provides methods to interact with ESG Copilot backend API
 */

import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import type { ChatQueryRequestType, ChatResponse } from '@shared/schema';

// Generate mock JWT token for demo
const getMockToken = () => {
  return 'Bearer mock-jwt-token-user-123-ESG_ANALYST';
};

export function useSendChatMessage() {
  return useMutation({
    mutationFn: async (request: ChatQueryRequestType) => {
      const response = await fetch('/api/v1/copilot/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getMockToken()
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to send message');
      }

      return response.json() as Promise<ChatResponse>;
    },
    onSuccess: (data) => {
      // Invalidate sessions cache
      queryClient.invalidateQueries({ queryKey: ['/api/v1/copilot/sessions'] });
    }
  });
}

export function useChatSession(sessionId: string | null) {
  return useQuery({
    queryKey: ['/api/v1/copilot/sessions', sessionId],
    enabled: !!sessionId,
    staleTime: 30000, // 30 seconds
  });
}

export function useChatSessions() {
  return useQuery({
    queryKey: ['/api/v1/copilot/sessions'],
    staleTime: 60000, // 1 minute
  });
}

// WebSocket hook for streaming
export function useWebSocketChat() {
  const connectWebSocket = (
    onMessage: (data: any) => void,
    onClose: () => void
  ) => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
      onClose();
    };

    return socket;
  };

  const sendMessage = (
    socket: WebSocket | null,
    sessionId: string | null,
    query: string,
    context: any
  ) => {
    if (!socket) {
      console.error('Cannot send message: WebSocket not connected');
      return;
    }

    const send = () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          type: 'chat_query',
          sessionId,
          query,
          context,
          token: getMockToken()
        }));
      }
    };

    // If socket is still connecting, wait for open event
    if (socket.readyState === WebSocket.CONNECTING) {
      socket.addEventListener('open', send, { once: true });
    } else if (socket.readyState === WebSocket.OPEN) {
      send();
    } else {
      console.error('Cannot send message: WebSocket is closed or closing');
    }
  };

  return { connectWebSocket, sendMessage };
}
