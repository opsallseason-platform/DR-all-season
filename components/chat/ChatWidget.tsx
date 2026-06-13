'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  sessionToken: string;
  status: string;
  language: string;
  messages: ChatMessage[];
  assignedAdminId?: string;
  escalatedAt?: Date;
  userAgent?: string;
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionToken, setSessionToken] = useState<string>('');
  const [customerId, setCustomerId] = useState<string | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // Initialize session token on component mount
  useEffect(() => {
    // Check if user is authenticated and get their ID
    const checkAuth = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setCustomerId(user.id);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      }
    };
    
    checkAuth();
    
    // Generate a unique session token if one doesn't exist
    if (!sessionToken) {
      const token = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setSessionToken(token);
    }
  }, [sessionToken]);

  // Fetch existing chat session if we have a token and send initial greeting
  useEffect(() => {
    if (sessionToken) {
      fetchChatSession();
    }
  }, [sessionToken]);

  // Poll for new messages every 2 seconds when chat is open
  useEffect(() => {
    if (!isOpen || !sessionToken) return;

    const pollInterval = setInterval(() => {
      fetchChatSession();
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(pollInterval);
  }, [isOpen, sessionToken]);

  // Send initial greeting when chat is first opened and has no messages
  useEffect(() => {
    if (isOpen && sessionToken && messages.length === 0) {
      sendInitialGreeting();
    }
  }, [isOpen, sessionToken]);

  const sendInitialGreeting = async () => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionToken,
          message: '__INITIAL_GREETING__',
          customerId: customerId || undefined,
        }),
      });

      const data = await response.json();

      if (data.success && data.message) {
        setMessages([data.message]);
      }
    } catch (error) {
      console.error('Error sending initial greeting:', error);
    }
  };

  // Scroll to bottom of messages when they change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    // Add user message to UI immediately
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionToken,
          message: inputValue,
          customerId: customerId || undefined,
        }),
      });

      const data = await response.json();

      if (data.success && data.message) {
        // Add AI response to messages
        setMessages([...updatedMessages, data.message]);
      } else if (data.success && !data.message) {
        // Session escalated, no bot response
        // Keep messages as is (only user message)
      } else {
        console.error('Error sending message:', data.error);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-2xl hover:shadow-blue-500/50 hover:scale-110 transition-all duration-300 z-50 group"
          aria-label="Open chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-[calc(100%-3rem)] max-w-md h-[100vh] sm:h-[600px] bg-white sm:rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-100 overflow-hidden">
          {/* Chat Header - Premium Gradient */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white p-5 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg">D.R All Season</h3>
                <p className="text-xs text-blue-100 flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5 animate-pulse"></span>
                  Online now
                </p>
              </div>
            </div>
            <button 
              onClick={closeChat}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors focus:outline-none"
              aria-label="Close chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-white">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 text-lg mb-2">Welcome to D.R All Season!</h4>
                <p className="text-gray-600 text-sm max-w-xs">Start a conversation with our team. We typically reply within minutes.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-sm ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-none'
                          : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <div
                        className={`text-xs mt-1.5 ${
                          message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start animate-fade-in">
                    <div className="bg-white text-gray-800 border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm">
                      <div className="flex space-x-1.5">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Chat Input - Premium Design */}
          <div className="border-t border-gray-200 p-4 bg-white">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                disabled={isLoading}
              />
              <button 
                type="submit" 
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-blue-500/50 font-medium"
                disabled={isLoading || !inputValue.trim()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-2 text-center">We typically reply in a few minutes</p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}