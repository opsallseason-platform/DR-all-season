import { createClient } from '@/lib/supabase/server';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'admin';
  content: string;
  timestamp: Date;
}

export interface ChatSession {
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
  customerId?: string;
}

/**
 * Creates a new chat session
 */
export async function createChatSession(
  sessionToken: string,
  language: string = 'en',
  userAgent?: string,
  ipAddress?: string,
  customerId?: string
): Promise<ChatSession | null> {
  try {
    const supabase = await createClient();

    const now = new Date().toISOString();
    const newSession = {
      id: crypto.randomUUID(),
      session_token: sessionToken,
      status: 'active',
      channel: 'web',
      language,
      messages: [],
      user_agent: userAgent || '',
      ip_address: ipAddress || '',
      created_at: now,
      updated_at: now,
      ...(customerId && { customer_id: customerId })
    };

    const { data, error } = await supabase
      .from('chat_sessions')
      .insert(newSession)
      .select()
      .single();

    if (error) {
      console.error('Error creating chat session:', error);
      return null;
    }

    return {
      ...data,
      messages: data.messages as ChatMessage[],
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      ...(data.escalated_at && { escalatedAt: new Date(data.escalated_at) }),
      ...(data.closed_at && { closedAt: new Date(data.closed_at) })
    } as ChatSession;
  } catch (error) {
    console.error('Error in createChatSession:', error);
    return null;
  }
}

/**
 * Gets a chat session by session token
 */
export async function getChatSession(sessionToken: string): Promise<ChatSession | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('session_token', sessionToken)
      .single();

    if (error) {
      console.error('Error fetching chat session:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    return {
      ...data,
      botData: data.bot_data,
      messages: data.messages as ChatMessage[],
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      ...(data.escalated_at && { escalatedAt: new Date(data.escalated_at) }),
      ...(data.closed_at && { closedAt: new Date(data.closed_at) })
    } as ChatSession;
  } catch (error) {
    console.error('Error in getChatSession:', error);
    return null;
  }
}

/**
 * Adds a message to a chat session
 */
export async function addMessageToSession(
  sessionToken: string,
  message: ChatMessage
): Promise<ChatSession | null> {
  try {
    const supabase = await createClient();

    const { data: existingSession, error: fetchError } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('session_token', sessionToken)
      .single();

    if (fetchError) {
      console.error('Error fetching existing chat session:', fetchError);
      return null;
    }

    if (!existingSession) {
      return null;
    }

    const updatedMessages = [...(existingSession.messages as ChatMessage[]), message];

    const { data, error } = await supabase
      .from('chat_sessions')
      .update({ 
        messages: updatedMessages,
        updated_at: new Date().toISOString()
      })
      .eq('session_token', sessionToken)
      .select()
      .single();

    if (error) {
      console.error('Error updating chat session:', error);
      return null;
    }

    return {
      ...data,
      botData: data.bot_data,
      messages: updatedMessages,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      ...(data.escalated_at && { escalatedAt: new Date(data.escalated_at) }),
      ...(data.closed_at && { closedAt: new Date(data.closed_at) })
    } as ChatSession;
  } catch (error) {
    console.error('Error in addMessageToSession:', error);
    return null;
  }
}

/**
 * Updates chat session status
 */
export async function updateChatSessionStatus(
  sessionToken: string,
  status: string
): Promise<ChatSession | null> {
  try {
    const supabase = await createClient();

    const updateData: any = { status };

    // If closing the session, update closed_at timestamp
    if (status === 'closed') {
      updateData.closed_at = new Date().toISOString();
    } else if (status === 'active') {
      updateData.closed_at = null;
    }

    const { data, error } = await supabase
      .from('chat_sessions')
      .update(updateData)
      .eq('session_token', sessionToken)
      .select()
      .single();

    if (error) {
      console.error('Error updating chat session status:', error);
      return null;
    }

    return {
      ...data,
      messages: data.messages as ChatMessage[],
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      ...(data.escalated_at && { escalatedAt: new Date(data.escalated_at) }),
      ...(data.closed_at && { closedAt: new Date(data.closed_at) })
    } as ChatSession;
  } catch (error) {
    console.error('Error in updateChatSessionStatus:', error);
    return null;
  }
}

/**
 * Assigns a chat session to an admin
 */
export async function assignChatSessionToAdmin(
  sessionToken: string,
  adminId: string
): Promise<ChatSession | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('chat_sessions')
      .update({ 
        assigned_admin_id: adminId,
        escalated_at: new Date().toISOString()
      })
      .eq('session_token', sessionToken)
      .select()
      .single();

    if (error) {
      console.error('Error assigning chat session to admin:', error);
      return null;
    }

    return {
      ...data,
      messages: data.messages as ChatMessage[],
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      ...(data.escalated_at && { escalatedAt: new Date(data.escalated_at) }),
      ...(data.closed_at && { closedAt: new Date(data.closed_at) })
    } as ChatSession;
  } catch (error) {
    console.error('Error in assignChatSessionToAdmin:', error);
    return null;
  }
}

/**
 * Gets all active chat sessions
 */
export async function getActiveChatSessions(): Promise<ChatSession[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching active chat sessions:', error);
      return [];
    }

    return data.map(session => ({
      ...session,
      messages: session.messages as ChatMessage[],
      createdAt: new Date(session.created_at),
      updatedAt: new Date(session.updated_at),
      ...(session.escalated_at && { escalatedAt: new Date(session.escalated_at) }),
      ...(session.closed_at && { closedAt: new Date(session.closed_at) })
    })) as ChatSession[];
  } catch (error) {
    console.error('Error in getActiveChatSessions:', error);
    return [];
  }
}

/**
 * Gets chat sessions assigned to a specific admin
 */
export async function getChatSessionsForAdmin(adminId: string): Promise<ChatSession[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('assigned_admin_id', adminId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching chat sessions for admin:', error);
      return [];
    }

    return data.map(session => ({
      ...session,
      messages: session.messages as ChatMessage[],
      createdAt: new Date(session.created_at),
      updatedAt: new Date(session.updated_at),
      ...(session.escalated_at && { escalatedAt: new Date(session.escalated_at) }),
      ...(session.closed_at && { closedAt: new Date(session.closed_at) })
    })) as ChatSession[];
  } catch (error) {
    console.error('Error in getChatSessionsForAdmin:', error);
    return [];
  }
}