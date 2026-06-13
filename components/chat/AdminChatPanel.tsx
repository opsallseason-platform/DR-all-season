'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { ChatSession, getActiveChatSessions, getChatSessionsForAdmin, assignChatSessionToAdmin } from '@/lib/chat/service';

interface AdminChatPanelProps {
  adminId: string;
}

export default function AdminChatPanel({ adminId }: AdminChatPanelProps) {
  const [activeSessions, setActiveSessions] = useState<ChatSession[]>([]);
  const [assignedSessions, setAssignedSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadChatSessions();
  }, [adminId]);

  const loadChatSessions = async () => {
    try {
      setLoading(true);
      const [active, assigned] = await Promise.all([
        getActiveChatSessions(),
        getChatSessionsForAdmin(adminId)
      ]);
      
      setActiveSessions(active);
      setAssignedSessions(assigned);
    } catch (err) {
      setError('Failed to load chat sessions');
      console.error('Error loading chat sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignSession = async (sessionToken: string) => {
    try {
      const result = await assignChatSessionToAdmin(sessionToken, adminId);
      if (result) {
        loadChatSessions(); // Refresh the lists
      }
    } catch (err) {
      setError('Failed to assign chat session');
      console.error('Error assigning chat session:', err);
    }
  };

  const handleResolveSession = async (sessionToken: string) => {
    try {
      const response = await fetch(`/api/chat?sessionToken=${sessionToken}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'close',
          adminId
        }),
      });

      if (response.ok) {
        loadChatSessions(); // Refresh the lists
      } else {
        setError('Failed to close chat session');
      }
    } catch (err) {
      setError('Failed to close chat session');
      console.error('Error closing chat session:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-caribbean-teal"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Active Sessions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-deep-navy mb-4">Active Chat Sessions</h3>
        {activeSessions.length === 0 ? (
          <p className="text-slate-gray">No active chat sessions</p>
        ) : (
          <div className="space-y-4">
            {activeSessions.map((session) => (
              <div 
                key={session.id} 
                className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-deep-navy">
                        Session: {session.sessionToken.substring(0, 12)}...
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        session.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {session.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-gray">
                      Created: {new Date(session.createdAt).toLocaleString()}
                    </p>
                    <p className="text-sm text-slate-gray">
                      Last message: {session.messages.length > 0 
                        ? new Date(session.messages[session.messages.length - 1].timestamp).toLocaleString()
                        : 'N/A'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAssignSession(session.sessionToken)}
                      className="bg-caribbean-teal hover:bg-teal-600 text-white text-sm px-3 py-1"
                    >
                      Assign to me
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Assigned Sessions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-deep-navy mb-4">Your Assigned Sessions</h3>
        {assignedSessions.length === 0 ? (
          <p className="text-slate-gray">No assigned chat sessions</p>
        ) : (
          <div className="space-y-4">
            {assignedSessions.map((session) => (
              <div 
                key={session.id} 
                className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-deep-navy">
                        Session: {session.sessionToken.substring(0, 12)}...
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        session.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {session.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-gray">
                      Created: {new Date(session.createdAt).toLocaleString()}
                    </p>
                    <p className="text-sm text-slate-gray">
                      Last message: {session.messages.length > 0 
                        ? new Date(session.messages[session.messages.length - 1].timestamp).toLocaleString()
                        : 'N/A'}
                    </p>
                    <p className="text-sm text-slate-gray mt-1">
                      Messages: {session.messages.length}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => window.open(`/admin/chat/${session.sessionToken}`, '_blank')}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1"
                    >
                      View Chat
                    </Button>
                    <Button
                      onClick={() => handleResolveSession(session.sessionToken)}
                      className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1"
                    >
                      Resolve
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}