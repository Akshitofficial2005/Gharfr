// Chat and Communication Service
import { AnalyticsService } from './analyticsService';

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderType: 'student' | 'owner' | 'admin' | 'support';
  message: string;
  messageType: 'text' | 'image' | 'file' | 'location' | 'system';
  timestamp: Date;
  readBy: string[];
  metadata?: {
    fileName?: string;
    fileSize?: number;
    imageUrl?: string;
    coordinates?: { lat: number; lng: number };
  };
}

export interface Chat {
  id: string;
  participants: {
    studentId?: string;
    ownerId?: string;
    adminId?: string;
  };
  pgId?: string;
  subject: string;
  lastMessage?: ChatMessage;
  lastActivity: Date;
  unreadCount: { [userId: string]: number };
  status: 'active' | 'archived' | 'blocked';
  tags: string[];
}

export interface SupportTicket {
  id: string;
  studentId: string;
  category: 'booking' | 'payment' | 'technical' | 'complaint' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assignedTo?: string;
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
  chatId: string;
}

class ChatService {
  private static instance: ChatService;
  private chats: Chat[] = [];
  private messages: { [chatId: string]: ChatMessage[] } = {};
  private supportTickets: SupportTicket[] = [];

  private constructor() {
    this.initializeMockData();
  }

  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  private initializeMockData() {
    // Mock chats
    this.chats = [
      {
        id: 'chat_1',
        participants: { studentId: 'student_1', ownerId: 'owner_1' },
        pgId: 'pg_1',
        subject: 'Booking Inquiry - Koramangala PG',
        lastActivity: new Date(),
        unreadCount: { student_1: 0, owner_1: 2 },
        status: 'active',
        tags: ['booking', 'inquiry']
      }
    ];

    // Mock messages
    this.messages['chat_1'] = [
      {
        id: 'msg_1',
        chatId: 'chat_1',
        senderId: 'student_1',
        senderName: 'Raj Kumar',
        senderType: 'student',
        message: 'Hi, I\'m interested in the single room. Is it available for immediate move-in?',
        messageType: 'text',
        timestamp: new Date(Date.now() - 3600000),
        readBy: ['student_1', 'owner_1']
      },
      {
        id: 'msg_2',
        chatId: 'chat_1',
        senderId: 'owner_1',
        senderName: 'Mr. Sharma',
        senderType: 'owner',
        message: 'Yes, the room is available. When would you like to visit?',
        messageType: 'text',
        timestamp: new Date(Date.now() - 1800000),
        readBy: ['owner_1']
      }
    ];
  }

  // Get all chats for a user
  getUserChats(userId: string, userType: 'student' | 'owner' | 'admin'): Chat[] {
    return this.chats.filter(chat => {
      switch (userType) {
        case 'student':
          return chat.participants.studentId === userId;
        case 'owner':
          return chat.participants.ownerId === userId;
        case 'admin':
          return chat.participants.adminId === userId;
        default:
          return false;
      }
    }).sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime());
  }

  // Create new chat
  createChat(participants: Chat['participants'], pgId?: string, subject?: string): Chat {
    const chatId = `chat_${Date.now()}`;
    const newChat: Chat = {
      id: chatId,
      participants,
      pgId,
      subject: subject || 'New Conversation',
      lastActivity: new Date(),
      unreadCount: {},
      status: 'active',
      tags: []
    };

    this.chats.push(newChat);
    this.messages[chatId] = [];

    AnalyticsService.getInstance().track('chat_created', {
      chatId,
      participants,
      pgId
    });

    return newChat;
  }

  // Send message
  sendMessage(chatId: string, senderId: string, senderName: string, senderType: ChatMessage['senderType'], message: string, messageType: ChatMessage['messageType'] = 'text', metadata?: ChatMessage['metadata']): ChatMessage {
    const messageId = `msg_${Date.now()}`;
    const newMessage: ChatMessage = {
      id: messageId,
      chatId,
      senderId,
      senderName,
      senderType,
      message,
      messageType,
      timestamp: new Date(),
      readBy: [senderId],
      metadata
    };

    if (!this.messages[chatId]) {
      this.messages[chatId] = [];
    }

    this.messages[chatId].push(newMessage);

    // Update chat's last activity and message
    const chat = this.chats.find(c => c.id === chatId);
    if (chat) {
      chat.lastMessage = newMessage;
      chat.lastActivity = new Date();
      
      // Update unread counts for other participants
      Object.values(chat.participants).forEach(participantId => {
        if (participantId && participantId !== senderId) {
          chat.unreadCount[participantId] = (chat.unreadCount[participantId] || 0) + 1;
        }
      });
    }

    AnalyticsService.getInstance().track('message_sent', {
      chatId,
      senderId,
      messageType,
      messageLength: message.length
    });

    return newMessage;
  }

  // Get messages for a chat
  getChatMessages(chatId: string, limit: number = 50, offset: number = 0): ChatMessage[] {
    const messages = this.messages[chatId] || [];
    return messages
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
      .slice(offset, offset + limit);
  }

  // Mark messages as read
  markAsRead(chatId: string, userId: string): void {
    const messages = this.messages[chatId] || [];
    messages.forEach(message => {
      if (!message.readBy.includes(userId)) {
        message.readBy.push(userId);
      }
    });

    // Reset unread count
    const chat = this.chats.find(c => c.id === chatId);
    if (chat) {
      chat.unreadCount[userId] = 0;
    }

    AnalyticsService.getInstance().track('messages_marked_read', {
      chatId,
      userId
    });
  }

  // Create support ticket
  createSupportTicket(studentId: string, category: SupportTicket['category'], subject: string, description: string, priority: SupportTicket['priority'] = 'medium'): SupportTicket {
    const ticketId = `ticket_${Date.now()}`;
    const chatId = `support_chat_${Date.now()}`;

    const ticket: SupportTicket = {
      id: ticketId,
      studentId,
      category,
      priority,
      subject,
      description,
      status: 'open',
      attachments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      chatId
    };

    this.supportTickets.push(ticket);

    // Create associated chat
    this.createChat(
      { studentId, adminId: 'support_admin' },
      undefined,
      `Support: ${subject}`
    );

    // Send initial system message
    this.sendMessage(
      chatId,
      'system',
      'Support System',
      'admin',
      `Support ticket #${ticketId} has been created. Our team will respond shortly.`,
      'system'
    );

    AnalyticsService.getInstance().track('support_ticket_created', {
      ticketId,
      category,
      priority,
      studentId
    });

    return ticket;
  }

  // Get support tickets for a user
  getSupportTickets(studentId: string): SupportTicket[] {
    return this.supportTickets
      .filter(ticket => ticket.studentId === studentId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Update support ticket status
  updateTicketStatus(ticketId: string, status: SupportTicket['status'], assignedTo?: string): boolean {
    const ticket = this.supportTickets.find(t => t.id === ticketId);
    if (ticket) {
      ticket.status = status;
      ticket.updatedAt = new Date();
      if (assignedTo) {
        ticket.assignedTo = assignedTo;
      }

      AnalyticsService.getInstance().track('support_ticket_updated', {
        ticketId,
        status,
        assignedTo
      });

      return true;
    }
    return false;
  }

  // Get FAQ suggestions based on message content
  getFAQSuggestions(message: string): string[] {
    const faqDatabase = [
      'What documents are required for booking?',
      'How do I pay the monthly rent?',
      'What is the cancellation policy?',
      'Are meals included in the rent?',
      'What are the visiting hours?',
      'Is WiFi included?',
      'How do I report maintenance issues?',
      'Can I get a refund for my security deposit?'
    ];

    // Simple keyword matching for FAQ suggestions
    const keywords = message.toLowerCase().split(' ');
    const suggestions = faqDatabase.filter(faq => {
      const faqKeywords = faq.toLowerCase().split(' ');
      return keywords.some(keyword => faqKeywords.some(faqKeyword => faqKeyword.includes(keyword)));
    });

    return suggestions.slice(0, 3);
  }

  // Block/Unblock user
  blockUser(chatId: string, userId: string, block: boolean = true): boolean {
    const chat = this.chats.find(c => c.id === chatId);
    if (chat) {
      chat.status = block ? 'blocked' : 'active';
      
      AnalyticsService.getInstance().track(block ? 'user_blocked' : 'user_unblocked', {
        chatId,
        userId
      });

      return true;
    }
    return false;
  }

  // Search messages
  searchMessages(query: string, userId: string): ChatMessage[] {
    const userChats = this.getUserChats(userId, 'student'); // Assume student for now
    const allMessages: ChatMessage[] = [];

    userChats.forEach(chat => {
      const chatMessages = this.messages[chat.id] || [];
      allMessages.push(...chatMessages);
    });

    return allMessages.filter(message => 
      message.message.toLowerCase().includes(query.toLowerCase())
    ).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Get unread message count for user
  getUnreadCount(userId: string): number {
    const userChats = this.getUserChats(userId, 'student'); // Assume student for now
    return userChats.reduce((total, chat) => total + (chat.unreadCount[userId] || 0), 0);
  }
}

export const chatService = ChatService.getInstance();
