import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Users, Mail, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

interface NotificationResult {
  success: boolean;
  email?: { success: boolean; messageId?: string; error?: string };
  sms?: { success: boolean; service?: string; error?: string };
}

const NotificationPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'promo' | 'test' | 'bulk'>('promo');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NotificationResult | null>(null);
  
  // Form states
  const [promoForm, setPromoForm] = useState({
    userId: '',
    promoContent: ''
  });
  
  const [testForm, setTestForm] = useState({
    email: '',
    phone: '',
    testMessage: ''
  });
  
  const [bulkForm, setBulkForm] = useState({
    userType: 'all',
    promoContent: ''
  });

  const sendPromoNotification = async () => {
    if (!promoForm.userId || !promoForm.promoContent) {
      alert('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/notifications/send-promo/${promoForm.userId}`,
        { promoContent: promoForm.promoContent },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`
          }
        }
      );
      
      setResult(response.data.results);
      setPromoForm({ userId: '', promoContent: '' });
    } catch (error: any) {
      console.error('Promo notification error:', error);
      alert(error.response?.data?.message || 'Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  const sendTestNotification = async () => {
    if (!testForm.email && !testForm.phone) {
      alert('Please provide email or phone number');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/notifications/test`,
        testForm,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`
          }
        }
      );
      
      setResult(response.data.results);
      setTestForm({ email: '', phone: '', testMessage: '' });
    } catch (error: any) {
      console.error('Test notification error:', error);
      alert(error.response?.data?.message || 'Failed to send test notification');
    } finally {
      setLoading(false);
    }
  };

  const sendBulkPromotion = async () => {
    if (!bulkForm.promoContent) {
      alert('Please enter promotional content');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/notifications/send-bulk-promo`,
        bulkForm,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`
          }
        }
      );
      
      setResult({ success: true });
      setBulkForm({ userType: 'all', promoContent: '' });
      alert(`Bulk notifications sent successfully to users!`);
    } catch (error: any) {
      console.error('Bulk notification error:', error);
      alert(error.response?.data?.message || 'Failed to send bulk notifications');
    } finally {
      setLoading(false);
    }
  };

  const ResultDisplay: React.FC<{ result: NotificationResult }> = ({ result }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 p-4 bg-gray-50 rounded-lg"
    >
      <h4 className="font-semibold mb-2 flex items-center">
        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
        Notification Results
      </h4>
      
      {result.email && (
        <div className="mb-2">
          <span className="text-sm font-medium">Email:</span>
          <span className={`ml-2 text-sm ${result.email.success ? 'text-green-600' : 'text-red-600'}`}>
            {result.email.success ? '✅ Sent successfully' : `❌ Failed: ${result.email.error}`}
          </span>
        </div>
      )}
      
      {result.sms && (
        <div>
          <span className="text-sm font-medium">SMS:</span>
          <span className={`ml-2 text-sm ${result.sms.success ? 'text-green-600' : 'text-red-600'}`}>
            {result.sms.success ? `✅ Sent via ${result.sms.service}` : `❌ Failed: ${result.sms.error}`}
          </span>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <Send className="w-6 h-6 text-blue-600 mr-2" />
        Notification Center
      </h3>

      {/* Tabs */}
      <div className="flex mb-6 border-b">
        {[
          { id: 'promo', label: 'Send Promo', icon: Mail },
          { id: 'test', label: 'Test Notification', icon: MessageSquare },
          { id: 'bulk', label: 'Bulk Promotion', icon: Users }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center px-4 py-2 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Promotional Notification Form */}
      {activeTab === 'promo' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User ID
            </label>
            <input
              type="text"
              value={promoForm.userId}
              onChange={(e) => setPromoForm({ ...promoForm, userId: e.target.value })}
              placeholder="Enter user ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Promotional Content
            </label>
            <textarea
              value={promoForm.promoContent}
              onChange={(e) => setPromoForm({ ...promoForm, promoContent: e.target.value })}
              placeholder="Enter your promotional message..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button
            onClick={sendPromoNotification}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
          >
            {loading ? 'Sending...' : 'Send Promotion'}
            <Send className="w-4 h-4 ml-2" />
          </button>
        </motion.div>
      )}

      {/* Test Notification Form */}
      {activeTab === 'test' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email (Optional)
            </label>
            <input
              type="email"
              value={testForm.email}
              onChange={(e) => setTestForm({ ...testForm, email: e.target.value })}
              placeholder="test@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              value={testForm.phone}
              onChange={(e) => setTestForm({ ...testForm, phone: e.target.value })}
              placeholder="+91 9876543210"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Test Message
            </label>
            <textarea
              value={testForm.testMessage}
              onChange={(e) => setTestForm({ ...testForm, testMessage: e.target.value })}
              placeholder="Enter test message (optional - default will be used)"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button
            onClick={sendTestNotification}
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center"
          >
            {loading ? 'Sending...' : 'Send Test'}
            <MessageSquare className="w-4 h-4 ml-2" />
          </button>
        </motion.div>
      )}

      {/* Bulk Promotion Form */}
      {activeTab === 'bulk' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Users
            </label>
            <select
              value={bulkForm.userType}
              onChange={(e) => setBulkForm({ ...bulkForm, userType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Users</option>
              <option value="users">Tenants Only</option>
              <option value="owners">Property Owners Only</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Promotional Content
            </label>
            <textarea
              value={bulkForm.promoContent}
              onChange={(e) => setBulkForm({ ...bulkForm, promoContent: e.target.value })}
              placeholder="Enter your bulk promotional message..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-yellow-500 mr-2" />
              <span className="text-sm text-yellow-700">
                Bulk notifications are limited to 100 users to avoid overwhelming free SMS services.
              </span>
            </div>
          </div>
          
          <button
            onClick={sendBulkPromotion}
            disabled={loading}
            className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50 flex items-center"
          >
            {loading ? 'Sending...' : 'Send Bulk Promotion'}
            <Users className="w-4 h-4 ml-2" />
          </button>
        </motion.div>
      )}

      {/* Results Display */}
      {result && <ResultDisplay result={result} />}
    </div>
  );
};

export default NotificationPanel;
