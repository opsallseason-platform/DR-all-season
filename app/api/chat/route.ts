import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { addMessageToSession, getChatSession, createChatSession, updateChatSessionStatus, assignChatSessionToAdmin } from '@/lib/chat/service';
import { cookies } from 'next/headers';

// Define types for chat messages
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'admin';
  content: string;
  timestamp: Date;
  channel?: string;
}

interface ChatSessionData {
  id: string;
  sessionToken: string;
  status: string;
  language: string;
  messages: ChatMessage[];
  botData?: any;
  assignedAdminId?: string;
  escalatedAt?: Date;
  userAgent?: string;
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
}

// Rule-based bot responses (premium, no emojis)
const BOT_RESPONSES = {
  greeting: {
    en: "Hello! I'm D.R All Season's assistant. I can help you with:\n\n1. Tours & Excursions\n2. Airport Transfers\n3. Pricing Information\n4. Speak to a Human Agent\n\nPlease reply with a number.",
    es: "¡Hola! Soy el asistente de D.R All Season. Puedo ayudarte con:\n\n1. Tours y Excursiones\n2. Traslados al Aeropuerto\n3. Información de Precios\n4. Hablar con un Agente Humano\n\nPor favor responde con un número."
  },
  collectName: {
    en: "Great! To assist you better, may I have your name?",
    es: "¡Genial! Para ayudarte mejor, ¿puedo saber tu nombre?"
  },
  collectEmail: {
    en: "Thanks {name}! What's the best email to send you information?",
    es: "¡Gracias {name}! ¿Cuál es el mejor correo para enviarte información?"
  },
  collectDate: {
    en: "Perfect! When are you planning to visit? (Please use format: YYYY-MM-DD)",
    es: "¡Perfecto! ¿Cuándo planeas visitarnos? (Usa formato: YYYY-MM-DD)"
  },
  collectGuests: {
    en: "How many guests will be joining?",
    es: "¿Cuántos huéspedes los acompañarán?"
  },
  escalateToHuman: {
    en: "Connecting you with a live agent. They'll respond shortly!",
    es: "Conectándote con un agente en vivo. ¡Responderán pronto!"
  },
  tourInfo: {
    en: "We offer amazing tours including:\n\n• Saona Island Paradise Tour\n• Santo Domingo City Tour\n• Catalina Island Snorkeling\n• Samana Whale Watching (seasonal)\n• And more!\n\nWould you like to book? (Yes/No)",
    es: "Ofrecemos tours increíbles incluyendo:\n\n• Tour Paraíso Isla Saona\n• Tour Ciudad Santo Domingo\n• Snorkel Isla Catalina\n• Avistamiento Ballenas Samaná (temporada)\n• ¡Y más!\n\n¿Te gustaría reservar? (Sí/No)"
  },
  transferInfo: {
    en: "We provide private airport transfers:\n\n• Punta Cana Airport ↔ Bavaro / Punta Cana Hotels\n• Punta Cana Airport ↔ Cabeza de Toro / Av. Barceló (🎉 PROMO $18!)\n• Punta Cana Airport ↔ Cap Cana\n• Punta Cana Airport ↔ Uvero Alto\n• Punta Cana Airport ↔ La Romana / Bayahibe\n• Punta Cana Airport ↔ Santo Domingo\n\nComfortable vehicles, professional drivers!\n\nWould you like to book? (Yes/No)",
    es: "Ofrecemos traslados privados al aeropuerto:\n\n• Aeropuerto Punta Cana ↔ Hoteles Bavaro / Punta Cana\n• Aeropuerto Punta Cana ↔ Cabeza de Toro / Av. Barceló (🎉 ¡PROMO $18!)\n• Aeropuerto Punta Cana ↔ Cap Cana\n• Aeropuerto Punta Cana ↔ Uvero Alto\n• Aeropuerto Punta Cana ↔ La Romana / Bayahibe\n• Aeropuerto Punta Cana ↔ Santo Domingo\n\n¡Vehículos cómodos, conductores profesionales!\n\n¿Te gustaría reservar? (Sí/No)"
  },
  pricingInfo: {
    en: "Our pricing is competitive and transparent:\n\n• Tours: From $45-$120 per person\n• Transfers: From $35-$85 per vehicle\n• Group discounts available!\n\nWhat service interests you?",
    es: "Nuestros precios son competitivos y transparentes:\n\n• Tours: Desde $45-$120 por persona\n• Traslados: Desde $35-$85 por vehículo\n• ¡Descuentos grupales disponibles!\n\n¿Qué servicio te interesa?"
  }
};

// Process user message and determine bot response
function processBotLogic(botData: any, userMessage: string, lang: 'en' | 'es') {
  let response = '';
  let shouldEscalate = false;
  const data = botData || { step: 'greeting' };

  // Handle initial greeting trigger
  if (userMessage === '__INITIAL_GREETING__') {
    response = BOT_RESPONSES.greeting[lang];
    data.step = 'greeting';
    return { response, botData: data, shouldEscalate };
  }

  // If already escalated or complete, don't send bot responses
  if (data.step === 'escalated' || data.step === 'complete') {
    return { response: '', botData: data, shouldEscalate: true };
  }

  // Check for human escalation keywords
  if (userMessage.toLowerCase().match(/agent|human|person|representative|hablar con alguien/i)) {
    response = BOT_RESPONSES.escalateToHuman[lang];
    shouldEscalate = true;
    data.step = 'escalated';
  }
  // Handle menu options
  else if (data.step === 'greeting') {
    if (userMessage === '1') {
      response = BOT_RESPONSES.tourInfo[lang];
      data.step = 'tour_interest';
      data.interest = 'tour';
    } else if (userMessage === '2') {
      response = BOT_RESPONSES.transferInfo[lang];
      data.step = 'transfer_interest';
      data.interest = 'transfer';
    } else if (userMessage === '3') {
      response = BOT_RESPONSES.pricingInfo[lang];
      data.step = 'pricing_interest';
    } else if (userMessage === '4') {
      response = BOT_RESPONSES.escalateToHuman[lang];
      shouldEscalate = true;
      data.step = 'escalated';
    } else {
      response = BOT_RESPONSES.greeting[lang];
    }
  }
  // Collect booking information
  else if (data.step === 'tour_interest' || data.step === 'transfer_interest') {
    if (userMessage.toLowerCase().match(/yes|sí|si|yeah|sure/i)) {
      response = BOT_RESPONSES.collectName[lang];
      data.step = 'collect_name';
    } else {
      response = BOT_RESPONSES.greeting[lang];
      data.step = 'greeting';
    }
  }
  else if (data.step === 'collect_name') {
    data.name = userMessage;
    response = BOT_RESPONSES.collectEmail[lang].replace('{name}', userMessage);
    data.step = 'collect_email';
  }
  else if (data.step === 'collect_email') {
    data.email = userMessage;
    response = BOT_RESPONSES.collectDate[lang];
    data.step = 'collect_date';
  }
  else if (data.step === 'collect_date') {
    data.date = userMessage;
    response = BOT_RESPONSES.collectGuests[lang];
    data.step = 'collect_guests';
  }
  else if (data.step === 'collect_guests') {
    data.guests = userMessage;
    response = lang === 'en' 
      ? `Perfect! I've collected your information:\n\nName: ${data.name}\nEmail: ${data.email}\nDate: ${data.date}\nGuests: ${userMessage}\n\nA live agent will contact you shortly to finalize your booking!`
      : `¡Perfecto! He recopilado tu información:

Nombre: ${data.name}
Email: ${data.email}
Fecha: ${data.date}
Huéspedes: ${userMessage}

¡Un agente en vivo te contactará pronto para finalizar tu reserva!`;
    shouldEscalate = true;
    data.step = 'complete';
  }
  else if (data.step === 'pricing_interest') {
    response = BOT_RESPONSES.collectName[lang];
    data.step = 'collect_name';
  }
  else {
    response = BOT_RESPONSES.greeting[lang];
    data.step = 'greeting';
  }

  return { response, botData: data, shouldEscalate };
}

export async function POST(request: NextRequest) {
  try {
    const { sessionToken, message, customerId, role = 'user' } = await request.json();

    // Get or create chat session
    let chatSession = await getChatSession(sessionToken);
    
    if (!chatSession) {
      chatSession = await createChatSession(
        sessionToken,
        'en',
        request.headers.get('user-agent') || '',
        request.ip || '',
        customerId
      );
      
      if (!chatSession) {
        return Response.json({ error: 'Failed to create chat session' }, { status: 500 });
      }
    }

    // If the message is from a user, generate bot response
    if (role === 'user') {
      const lang = (chatSession.language || 'en') as 'en' | 'es';
      const botData = (chatSession as any).botData || { step: 'greeting' };
      
      console.log('Current botData:', botData);
      console.log('User message:', message);
      
      // Process bot logic
      const { response, botData: updatedBotData, shouldEscalate } = processBotLogic(botData, message, lang);

      console.log('Updated botData:', updatedBotData);

      // If no response (escalated/complete), just update bot data and return
      if (!response) {
        const supabase = await createClient();
        await supabase
          .from('chat_sessions')
          .update({
            bot_data: updatedBotData,
            escalated_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('session_token', sessionToken);

        return Response.json({ 
          success: true, 
          message: null,
          session: chatSession,
          escalated: shouldEscalate
        });
      }

      // For initial greeting, don't add user message, only bot response
      const isInitialGreeting = message === '__INITIAL_GREETING__';
      
      let updatedSession: ChatSessionData | null = chatSession;
      
      if (!isInitialGreeting) {
        // Add the user message to the session
        const newMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'user',
          content: message,
          timestamp: new Date(),
          channel: 'web'
        };

        updatedSession = await addMessageToSession(sessionToken, newMessage);
        
        if (!updatedSession) {
          return Response.json({ error: 'Failed to add message to session' }, { status: 500 });
        }
      }

      // Create bot response message
      const aiResponse: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        channel: 'web'
      };

      // Add bot response to session
      const finalSession = await addMessageToSession(sessionToken, aiResponse);
      
      if (!finalSession) {
        return Response.json({ error: 'Failed to add AI response to session' }, { status: 500 });
      }

      // Update bot data and escalation status in database
      const supabase = await createClient();
      const updateData: any = {
        bot_data: updatedBotData,
        updated_at: new Date().toISOString()
      };
      
      if (shouldEscalate) {
        updateData.escalated_at = new Date().toISOString();
      }

      const { error: updateError } = await supabase
        .from('chat_sessions')
        .update(updateData)
        .eq('session_token', sessionToken);

      if (updateError) {
        console.error('Error updating botData:', updateError);
      }

      return Response.json({ 
        success: true, 
        message: aiResponse,
        session: finalSession,
        escalated: shouldEscalate
      });
    } else {
      // If the message is from an admin, add it to the session
      const newMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: role as 'user' | 'assistant' | 'admin',
        content: message,
        timestamp: new Date(),
        channel: 'web'
      };

      const updatedSession = await addMessageToSession(sessionToken, newMessage);
      
      if (!updatedSession) {
        return Response.json({ error: 'Failed to add message to session' }, { status: 500 });
      }
      
      return Response.json({ 
        success: true, 
        message: newMessage,
        session: updatedSession
      });
    }

  } catch (error) {
    console.error('Error in chat API:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.nextUrl.searchParams.get('sessionToken');
    
    if (!sessionToken) {
      return Response.json({ error: 'Session token is required' }, { status: 400 });
    }

    const chatSession = await getChatSession(sessionToken);

    if (!chatSession) {
      return Response.json({ error: 'Chat session not found' }, { status: 404 });
    }

    return Response.json({ session: chatSession });
  } catch (error) {
    console.error('Error in chat GET API:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const sessionToken = request.nextUrl.searchParams.get('sessionToken');
    const { action, adminId } = await request.json();
    
    if (!sessionToken) {
      return Response.json({ error: 'Session token is required' }, { status: 400 });
    }

    let result: any = null;

    switch (action) {
      case 'close':
        result = await updateChatSessionStatus(sessionToken, 'closed');
        break;
      case 'assign':
        if (!adminId) {
          return Response.json({ error: 'Admin ID is required for assignment' }, { status: 400 });
        }
        result = await assignChatSessionToAdmin(sessionToken, adminId);
        break;
      case 'reopen':
        result = await updateChatSessionStatus(sessionToken, 'active');
        break;
      default:
        return Response.json({ error: 'Invalid action' }, { status: 400 });
    }

    if (!result) {
      return Response.json({ error: 'Failed to update chat session' }, { status: 500 });
    }

    return Response.json({ 
      success: true, 
      session: result 
    });
  } catch (error) {
    console.error('Error in chat PUT API:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}