'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatContextType {
  isOpen: boolean;
  messages: ChatMessage[];
  isLoading: boolean;
  sessionToken: string;
  toggleChat: () => void;
  closeChat: () => void;
  sendMessage: (message: string) => Promise<void>;
  clearChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionToken, setSessionToken] = useState<string>('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // Initialize session token on component mount
  useEffect(() => {
    // Generate a unique session token if one doesn't exist
    if (!sessionToken) {
      const token = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setSessionToken(token);
    }
  }, [sessionToken]);

  // Fetch existing chat session if we have a token
  useEffect(() => {
    if (sessionToken) {
      fetchChatSession();
    }
  }, [sessionToken]);

  const fetchChatSession = async () => {
    try {
      const response = await fetch(`/api/chat?sessionToken=${sessionToken}`);
      const data = await response.json();

      if (data.session) {
        // Transform timestamp strings to Date objects
        const transformedMessages = data.session.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(transformedMessages);
      }
    } catch (error) {
      console.error('Error fetching chat session:', error);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  const sendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    // Add user message to UI immediately
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionToken,
          message,
        }),
      });

      const data = await response.json();

      if (data.success && data.message) {
        // Add AI response to messages
        setMessages([...updatedMessages, data.message]);
      } else {
        console.error('Error sending message:', data.error);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const value = {
    isOpen,
    messages,
    isLoading,
    sessionToken,
    toggleChat,
    closeChat,
    sendMessage,
    clearChat,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}