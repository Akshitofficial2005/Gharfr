import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Phone, Video, MoreVertical, Paperclip, 
  Smile, Search, Archive, Minus, Star 
} from 'lucide-react';
import { chatService, Chat, ChatMessage } from '../services/chatService';
import { useAuth } from '../contexts/AuthContext';
import { useNotificationHelpers } from '../contexts/NotificationContext';
import { AnalyticsService } from '../services/analyticsService';

interface ChatComponentProps {
  chatId?: string;
  pgId?: string;
  ownerId?: string;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ chatId, pgId, ownerId }) => {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotificationHelpers();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [faqSuggestions, setFAQSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (chatId) {
      loadChat(chatId);
    } else if (pgId && ownerId && user) {
      // Create new chat
      const chat = chatService.createChat(
        { studentId: user.id, ownerId },
        pgId,
        'PG Inquiry'
      );
      setCurrentChat(chat);
    }
  }, [chatId, pgId, ownerId, user]);

  useEffect(() => {
    if (currentChat) {
      loadMessages();
      markAsRead();
    }
  }, [currentChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChat = (id: string) => {
    // In real app, this would be an API call
    const userChats = chatService.getUserChats(user?.id || '', 'student');
    const chat = userChats.find(c => c.id === id);
    if (chat) {
      setCurrentChat(chat);
    }
  };

  const loadMessages = () => {
    if (currentChat) {
      const chatMessages = chatService.getChatMessages(currentChat.id);
      setMessages(chatMessages);
    }
  };

  const markAsRead = () => {
    if (currentChat && user) {
      chatService.markAsRead(currentChat.id, user.id);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !currentChat || !user) return;

    const message = chatService.sendMessage(
      currentChat.id,
      user.id,
      user.name || 'Student',
      'student',
      newMessage
    );

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // Auto-respond for demo
    setTimeout(() => {
      const ownerResponse = chatService.sendMessage(
        currentChat.id,
        'owner_1',
        'Mr. Sharma',
        'owner',
        'Thanks for your message! I\'ll get back to you shortly.'
      );
      setMessages(prev => [...prev, ownerResponse]);
    }, 2000);

    AnalyticsService.getInstance().track('message_sent', {
      chatId: currentChat.id,
      messageLength: newMessage.length
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleMessageChange = (value: string) => {
    setNewMessage(value);
    
    // Get FAQ suggestions based on message content
    if (value.length > 10) {
      const suggestions = chatService.getFAQSuggestions(value);
      setFAQSuggestions(suggestions);
      setShowFAQ(suggestions.length > 0);
    } else {
      setShowFAQ(false);
    }
  };

  const insertFAQ = (faq: string) => {
    setNewMessage(faq);
    setShowFAQ(false);
  };

  const formatTime = (timestamp: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(timestamp);
  };

  const formatDate = (timestamp: Date) => {
    const today = new Date();
    const messageDate = new Date(timestamp);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    return messageDate.toLocaleDateString('en-IN');
  };

  if (!currentChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
            {currentChat.participants.ownerId ? 'O' : 'S'}
          </div>
          <div className="ml-3">
            <h3 className="font-semibold text-gray-900">{currentChat.subject}</h3>
            <p className="text-sm text-gray-600">
              {currentChat.participants.ownerId ? 'PG Owner' : 'Student'} • Online
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full">
            <Phone className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full">
            <Video className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
          const showDate = index === 0 || 
            formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp);
          const isOwn = message.senderId === user?.id;

          return (
            <div key={message.id}>
              {showDate && (
                <div className="flex justify-center my-4">
                  <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {formatDate(message.timestamp)}
                  </span>
                </div>
              )}
              
              <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isOwn
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {!isOwn && (
                    <div className="text-xs font-semibold mb-1 text-gray-600">
                      {message.senderName}
                    </div>
                  )}
                  
                  {message.messageType === 'system' ? (
                    <div className="text-center text-sm italic text-gray-600 bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                      {message.message}
                    </div>
                  ) : (
                    <>
                      <p className="text-sm">{message.message}</p>
                      <div
                        className={`text-xs mt-1 ${
                          isOwn ? 'text-primary-200' : 'text-gray-500'
                        }`}
                      >
                        {formatTime(message.timestamp)}
                        {isOwn && message.readBy.length > 1 && (
                          <span className="ml-2">✓✓</span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* FAQ Suggestions */}
      {showFAQ && faqSuggestions.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-sm font-medium text-gray-700 mb-2">Quick suggestions:</p>
          <div className="space-y-2">
            {faqSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => insertFAQ(suggestion)}
                className="block w-full text-left text-sm text-primary-600 hover:text-primary-700 hover:bg-white p-2 rounded border border-gray-200"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <div className="relative">
              <textarea
                value={newMessage}
                onChange={(e) => handleMessageChange(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={1}
                style={{ minHeight: '44px', maxHeight: '120px' }}
              />
              <div className="absolute right-2 bottom-2 flex items-center space-x-1">
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <Paperclip className="h-4 w-4" />
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <Smile className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="p-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        
        {isTyping && (
          <div className="mt-2 text-sm text-gray-500">
            Owner is typing...
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatComponent;
