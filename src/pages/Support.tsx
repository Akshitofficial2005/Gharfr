import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, Phone, Mail, Search, Filter, 
  Clock, CheckCircle, AlertCircle, FileText,
  Plus, Send, Bot, User
} from 'lucide-react';
import { chatService, SupportTicket, ChatMessage } from '../services/chatService';
import { useAuth } from '../contexts/AuthContext';
import { useNotificationHelpers } from '../contexts/NotificationContext';
import { AnalyticsService } from '../services/analyticsService';

const Support: React.FC = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotificationHelpers();

  const [activeTab, setActiveTab] = useState<'chat' | 'tickets' | 'faq'>('chat');
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [newTicket, setNewTicket] = useState({
    category: 'general' as SupportTicket['category'],
    subject: '',
    description: '',
    priority: 'medium' as SupportTicket['priority']
  });
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);

  // Chatbot responses
  const botResponses = [
    {
      keywords: ['booking', 'book', 'reserve'],
      response: 'To book a PG, you can browse our listings, select your preferred room, and click "Book Now". You\'ll need to provide ID proof and pay the security deposit.'
    },
    {
      keywords: ['payment', 'pay', 'money', 'fee'],
      response: 'We accept UPI, credit/debit cards, net banking, and EMI options. All payments are secure and encrypted. You\'ll receive a receipt after successful payment.'
    },
    {
      keywords: ['cancel', 'cancellation', 'refund'],
      response: 'You can cancel your booking from your profile. Refund policies vary: Full refund within 24 hours, 50% refund 7 days before check-in, no refund after check-in.'
    },
    {
      keywords: ['documents', 'id', 'proof'],
      response: 'Required documents: Valid ID proof (Aadhar/Passport/Driving License), College ID, recent passport-size photos, and address proof.'
    },
    {
      keywords: ['contact', 'phone', 'call', 'owner'],
      response: 'You can contact the PG owner directly through our in-app chat after booking confirmation. Emergency support is available 24/7 at 1800-XXX-XXXX.'
    }
  ];

  const faqData = [
    {
      category: 'Booking',
      questions: [
        {
          q: 'How do I book a PG?',
          a: 'Browse listings, select your preferred room, and click "Book Now". Complete the payment and upload required documents to confirm your booking.'
        },
        {
          q: 'What documents are required?',
          a: 'You need valid ID proof, college ID, passport-size photos, and address proof. All documents should be clear and readable.'
        },
        {
          q: 'Can I visit the PG before booking?',
          a: 'Yes! You can schedule a visit through the "Schedule Visit" button on the PG listing page. We recommend visiting before making a decision.'
        }
      ]
    },
    {
      category: 'Payment',
      questions: [
        {
          q: 'What payment methods are accepted?',
          a: 'We accept UPI, credit/debit cards, net banking, wallets, and EMI options. All payments are processed securely.'
        },
        {
          q: 'When do I need to pay rent?',
          a: 'Monthly rent is due on the 1st of each month. You can set up auto-debit for convenience or pay manually through the app.'
        },
        {
          q: 'What is the platform fee?',
          a: 'Platform fee is 2% of the monthly rent, which helps us maintain the platform and provide 24/7 support services.'
        }
      ]
    },
    {
      category: 'Cancellation',
      questions: [
        {
          q: 'How do I cancel my booking?',
          a: 'Go to your profile > Bookings > Select booking > Cancel. Refund will be processed according to our cancellation policy.'
        },
        {
          q: 'What is the refund policy?',
          a: 'Full refund within 24 hours of booking, 50% refund if cancelled 7 days before check-in, no refund after check-in.'
        }
      ]
    }
  ];

  useEffect(() => {
    if (user) {
      loadSupportData();
    }
  }, [user]);

  const loadSupportData = () => {
    if (user) {
      const userTickets = chatService.getSupportTickets(user.id);
      setTickets(userTickets);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      chatId: 'support_chat',
      senderId: user.id,
      senderName: user.name || 'You',
      senderType: 'student',
      message: newMessage,
      messageType: 'text',
      timestamp: new Date(),
      readBy: [user.id]
    };

    setChatMessages(prev => [...prev, userMessage]);

    // Get bot response
    const botResponse = getBotResponse(newMessage);
    
    setIsTyping(true);
    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        chatId: 'support_chat',
        senderId: 'support_bot',
        senderName: 'Ghar Support Bot',
        senderType: 'admin',
        message: botResponse,
        messageType: 'text',
        timestamp: new Date(),
        readBy: ['support_bot']
      };

      setChatMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);

    setNewMessage('');

    AnalyticsService.getInstance().track('support_chat_message', {
      messageLength: newMessage.length,
      userId: user.id
    });
  };

  const getBotResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    for (const response of botResponses) {
      if (response.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return response.response;
      }
    }

    return 'I understand you need help with that. Let me connect you with our support team for personalized assistance. You can also create a support ticket for detailed help.';
  };

  const handleCreateTicket = () => {
    if (!user || !newTicket.subject || !newTicket.description) {
      showError('Validation Error', 'Please fill in all required fields');
      return;
    }

    const ticket = chatService.createSupportTicket(
      user.id,
      newTicket.category,
      newTicket.subject,
      newTicket.description,
      newTicket.priority
    );

    setTickets(prev => [ticket, ...prev]);
    setShowNewTicketForm(false);
    setNewTicket({
      category: 'general',
      subject: '',
      description: '',
      priority: 'medium'
    });

    showSuccess('Ticket Created', 'Your support ticket has been created successfully. Our team will respond soon.');

    AnalyticsService.getInstance().track('support_ticket_created', {
      category: newTicket.category,
      priority: newTicket.priority,
      userId: user.id
    });
  };

  const getStatusColor = (status: SupportTicket['status']) => {
    switch (status) {
      case 'open': return 'text-blue-600 bg-blue-100';
      case 'in_progress': return 'text-yellow-600 bg-yellow-100';
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'closed': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: SupportTicket['priority']) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Support Center</h1>
          <p className="text-gray-600 mt-2">Get help with bookings, payments, and account issues</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <MessageCircle className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900">Live Chat</h3>
                <p className="text-sm text-gray-600">Get instant help from our bot</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Phone className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900">Call Support</h3>
                <p className="text-sm text-gray-600">1800-XXX-XXXX (24/7)</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900">Email Support</h3>
                <p className="text-sm text-gray-600">support@ghar.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'chat', label: 'Live Chat', icon: MessageCircle },
              { id: 'tickets', label: 'Support Tickets', icon: FileText },
              { id: 'faq', label: 'FAQ', icon: Search }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="mr-2 h-5 w-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center">
                <Bot className="h-8 w-8 text-primary-600" />
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-900">Ghar Support Bot</h3>
                  <p className="text-sm text-gray-600">Online • Usually responds instantly</p>
                </div>
              </div>
            </div>

            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {chatMessages.length === 0 && (
                <div className="text-center py-8">
                  <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Hi! I'm here to help. Ask me anything about bookings, payments, or our services.</p>
                </div>
              )}

              {chatMessages.map(message => {
                const isBot = message.senderType === 'admin';
                return (
                  <div key={message.id} className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      isBot ? 'bg-gray-100 text-gray-900' : 'bg-primary-600 text-white'
                    }`}>
                      <div className="flex items-center mb-1">
                        {isBot ? <Bot className="h-4 w-4 mr-2" /> : <User className="h-4 w-4 mr-2" />}
                        <span className="text-xs font-semibold">{message.senderName}</span>
                      </div>
                      <p className="text-sm">{message.message}</p>
                      <div className="text-xs mt-1 opacity-75">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 px-4 py-2 rounded-lg">
                    <div className="flex items-center">
                      <Bot className="h-4 w-4 mr-2" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tickets Tab */}
        {activeTab === 'tickets' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Support Tickets</h2>
              <button
                onClick={() => setShowNewTicketForm(true)}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Ticket
              </button>
            </div>

            {showNewTicketForm && (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Support Ticket</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={newTicket.category}
                      onChange={(e) => setNewTicket(prev => ({ ...prev, category: e.target.value as any }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="booking">Booking</option>
                      <option value="payment">Payment</option>
                      <option value="technical">Technical</option>
                      <option value="complaint">Complaint</option>
                      <option value="general">General</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select
                      value={newTicket.priority}
                      onChange={(e) => setNewTicket(prev => ({ ...prev, priority: e.target.value as any }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Brief description of your issue"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newTicket.description}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Detailed description of your issue..."
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleCreateTicket}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                  >
                    Create Ticket
                  </button>
                  <button
                    onClick={() => setShowNewTicketForm(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {tickets.map(ticket => (
                <div key={ticket.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">#{ticket.id.slice(-6)} - {ticket.subject}</h3>
                      <p className="text-sm text-gray-600 mt-1">{ticket.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>
                        {(ticket.status || 'unknown').replace('_', ' ').toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Category:</span>
                      <span className="ml-1 capitalize">{ticket.category}</span>
                    </div>
                    <div>
                      <span className="font-medium">Created:</span>
                      <span className="ml-1">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="font-medium">Updated:</span>
                      <span className="ml-1">{new Date(ticket.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="font-medium">Assigned:</span>
                      <span className="ml-1">{ticket.assignedTo || 'Unassigned'}</span>
                    </div>
                  </div>
                </div>
              ))}

              {tickets.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No support tickets yet. Create one if you need help!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div className="space-y-6">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search FAQ..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {faqData.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">{category.category}</h3>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {category.questions.map((faq, faqIndex) => (
                    <details key={faqIndex} className="group">
                      <summary className="p-4 cursor-pointer hover:bg-gray-50 flex justify-between items-center">
                        <span className="font-medium text-gray-900">{faq.q}</span>
                        <Plus className="h-5 w-5 text-gray-400 group-open:rotate-45 transition-transform" />
                      </summary>
                      <div className="px-4 pb-4">
                        <p className="text-gray-600">{faq.a}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Support;
