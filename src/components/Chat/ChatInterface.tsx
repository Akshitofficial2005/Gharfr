import React, { useState, useEffect } from 'react';
import { Send, Phone } from 'lucide-react';
import { realSocketService } from '../../utils/realSocket';

interface Message {
  _id: string;
  sender: { _id: string; name: string };
  message: string;
  createdAt: string;
  isRead: boolean;
}

interface ChatInterfaceProps {
  recipientId: string;
  recipientName: string;
  currentUserId: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ recipientId, recipientName, currentUserId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    loadMessages();
    setupRealTimeChat();
    
    return () => {
      realSocketService.off('newMessage');
      realSocketService.off('userTyping');
    };
  }, [recipientId]);

  const loadMessages = async () => {
    try {
      const response = await fetch(`/api/messages/${recipientId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealTimeChat = () => {
    // Connect to real-time chat
    realSocketService.connect(currentUserId);
    
    // Listen for new messages
    realSocketService.onNewMessage((message) => {
      if (message.sender._id === recipientId || message.receiver._id === recipientId) {
        setMessages(prev => [...prev, message]);
      }
    });
    
    // Listen for typing indicators
    realSocketService.onUserTyping(({ userId, typing }) => {
      if (userId === recipientId) {
        setTyping(typing);
      }
    });
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      receiverId: recipientId,
      message: newMessage.trim(),
      messageType: 'text'
    };

    try {
      // Send via Socket.IO for real-time delivery
      realSocketService.sendMessage(messageData);
      
      // Also save to database via API
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          receiver: recipientId,
          message: newMessage.trim(),
          messageType: 'text'
        })
      });

      if (response.ok) {
        setNewMessage('');
        realSocketService.sendTyping(recipientId, false);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleTyping = (typing: boolean) => {
    realSocketService.sendTyping(recipientId, typing);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-96 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">
              {recipientName.charAt(0).toUpperCase()}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900">{recipientName}</h3>
        </div>
        
        <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
          <Phone className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`flex ${message.sender._id === currentUserId ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.sender._id === currentUserId
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              <p className="text-sm">{message.message}</p>
              <span className="text-xs opacity-75">
                {formatTime(message.createdAt)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;