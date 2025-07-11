import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Copy, 
  Calendar, 
  Users, 
  IndianRupee, 
  Percent,
  Filter,
  Search,
  Download,
  Gift,
  Target,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { PromoCode } from '../types/enhanced';

interface PromoCodeStats {
  totalCodes: number;
  activeCodes: number;
  totalUsage: number;
  totalSavings: number;
  topPerformingCode: string;
  conversionRate: number;
}

const PromoCodeManager: React.FC = () => {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [stats, setStats] = useState<PromoCodeStats>({
    totalCodes: 0,
    activeCodes: 0,
    totalUsage: 0,
    totalSavings: 0,
    topPerformingCode: '',
    conversionRate: 0
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPromoCode, setNewPromoCode] = useState<Partial<PromoCode>>({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: 0,
    minBookingAmount: 0,
    maxDiscount: 0,
    usageLimit: 1,
    validFrom: '',
    validTo: '',
    active: true
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const fetchPromoCodes = async () => {
    try {
      setLoading(true);
      
      // Mock promo codes data
      const mockPromoCodes: PromoCode[] = [
        {
          id: '1',
          code: 'STUDENT20',
          description: '20% off for new students',
          discountType: 'percentage',
          discountValue: 20,
          minBookingAmount: 5000,
          maxDiscount: 2000,
          usageLimit: 1000,
          usedCount: 245,
          validFrom: '2024-01-01',
          validTo: '2024-12-31',
          active: true
        },
        {
          id: '2',
          code: 'FIRSTBOOKING',
          description: 'Flat ₹1000 off on first booking',
          discountType: 'fixed',
          discountValue: 1000,
          minBookingAmount: 8000,
          maxDiscount: 1000,
          usageLimit: 500,
          usedCount: 89,
          validFrom: '2024-01-01',
          validTo: '2024-06-30',
          active: true
        },
        {
          id: '3',
          code: 'SUMMER50',
          description: 'Summer special - 50% off premium rooms',
          discountType: 'percentage',
          discountValue: 50,
          minBookingAmount: 10000,
          maxDiscount: 5000,
          usageLimit: 200,
          usedCount: 156,
          validFrom: '2024-04-01',
          validTo: '2024-06-30',
          active: false
        }
      ];

      setPromoCodes(mockPromoCodes);

      // Calculate stats
      const activeCodes = mockPromoCodes.filter(code => code.active).length;
      const totalUsage = mockPromoCodes.reduce((sum, code) => sum + code.usedCount, 0);
      const totalSavings = mockPromoCodes.reduce((sum, code) => {
        return sum + (code.discountType === 'fixed' ? code.discountValue * code.usedCount : 0);
      }, 0);

      setStats({
        totalCodes: mockPromoCodes.length,
        activeCodes,
        totalUsage,
        totalSavings,
        topPerformingCode: mockPromoCodes.sort((a, b) => b.usedCount - a.usedCount)[0]?.code || '',
        conversionRate: 15.8
      });

    } catch (error) {
      console.error('Error fetching promo codes:', error);
      toast.error('Failed to load promo codes');
    } finally {
      setLoading(false);
    }
  };

  const createPromoCode = async () => {
    try {
      if (!newPromoCode.code || !newPromoCode.description || !newPromoCode.discountValue) {
        toast.error('Please fill in all required fields');
        return;
      }

      const promoCode: PromoCode = {
        id: Date.now().toString(),
        code: newPromoCode.code!.toUpperCase(),
        description: newPromoCode.description!,
        discountType: newPromoCode.discountType!,
        discountValue: newPromoCode.discountValue!,
        minBookingAmount: newPromoCode.minBookingAmount || 0,
        maxDiscount: newPromoCode.maxDiscount || 0,
        usageLimit: newPromoCode.usageLimit || 1,
        usedCount: 0,
        validFrom: newPromoCode.validFrom!,
        validTo: newPromoCode.validTo!,
        active: newPromoCode.active!
      };

      setPromoCodes(prev => [promoCode, ...prev]);
      setShowCreateModal(false);
      setNewPromoCode({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: 0,
        minBookingAmount: 0,
        maxDiscount: 0,
        usageLimit: 1,
        validFrom: '',
        validTo: '',
        active: true
      });
      toast.success('Promo code created successfully');
    } catch (error) {
      console.error('Error creating promo code:', error);
      toast.error('Failed to create promo code');
    }
  };

  const handleToggleStatus = (id: string) => {
    setPromoCodes(prev => prev.map(code => 
      code.id === id ? { ...code, active: !code.active } : code
    ));
    toast.success('Promo code status updated');
  };

  const handleDeletePromoCode = (id: string) => {
    setPromoCodes(prev => prev.filter(code => code.id !== id));
    toast.success('Promo code deleted');
  };

  const getStatusBadge = (active: boolean) => {
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
        active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {active ? 'Active' : 'Inactive'}
      </span>
    );
  };

  const getUsageProgress = (usedCount: number, usageLimit: number) => {
    const percentage = (usedCount / usageLimit) * 100;
    return (
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full" 
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Promo Code Management</h2>
          <p className="text-gray-600">Create and manage promotional campaigns</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Promo Code
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Codes</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalCodes}</p>
            </div>
            <Gift className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Codes</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.activeCodes}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Usage</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalUsage}</p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Savings</p>
              <p className="text-2xl font-semibold text-gray-900">₹{stats.totalSavings.toLocaleString()}</p>
            </div>
            <IndianRupee className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Promo Codes Table */}
      <div className="bg-white rounded-lg shadow-md border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">All Promo Codes</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valid Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {promoCodes.map((promoCode) => (
                <tr key={promoCode.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{promoCode.code}</div>
                    <div className="text-sm text-gray-500">{promoCode.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {promoCode.discountType === 'percentage' ? (
                        <span className="flex items-center">
                          <Percent className="w-4 h-4 mr-1" />
                          {promoCode.discountValue}% off
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <IndianRupee className="w-4 h-4 mr-1" />
                          ₹{promoCode.discountValue} off
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      Min: ₹{promoCode.minBookingAmount}
                      {promoCode.maxDiscount && promoCode.maxDiscount > 0 && ` | Max: ₹${promoCode.maxDiscount}`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {promoCode.usedCount} / {promoCode.usageLimit}
                    </div>
                    <div className="mt-1">
                      {getUsageProgress(promoCode.usedCount, promoCode.usageLimit)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(promoCode.validFrom).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      to {new Date(promoCode.validTo).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(promoCode.active)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(promoCode.id)}
                        className={`${promoCode.active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                      >
                        {promoCode.active ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDeletePromoCode(promoCode.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Promo Code</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Promo Code *
                  </label>
                  <input
                    type="text"
                    value={newPromoCode.code}
                    onChange={(e) => setNewPromoCode(prev => ({ ...prev, code: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="STUDENT20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Type *
                  </label>
                  <select
                    value={newPromoCode.discountType}
                    onChange={(e) => setNewPromoCode(prev => ({ ...prev, discountType: e.target.value as 'percentage' | 'fixed' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <input
                  type="text"
                  value={newPromoCode.description}
                  onChange={(e) => setNewPromoCode(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="20% off for new students"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {newPromoCode.discountType === 'percentage' ? 'Percentage *' : 'Amount *'}
                  </label>
                  <input
                    type="number"
                    value={newPromoCode.discountValue}
                    onChange={(e) => setNewPromoCode(prev => ({ ...prev, discountValue: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder={newPromoCode.discountType === 'percentage' ? '20' : '1000'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Amount
                  </label>
                  <input
                    type="number"
                    value={newPromoCode.minBookingAmount}
                    onChange={(e) => setNewPromoCode(prev => ({ ...prev, minBookingAmount: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="5000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Discount
                  </label>
                  <input
                    type="number"
                    value={newPromoCode.maxDiscount}
                    onChange={(e) => setNewPromoCode(prev => ({ ...prev, maxDiscount: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="2000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    value={newPromoCode.usageLimit}
                    onChange={(e) => setNewPromoCode(prev => ({ ...prev, usageLimit: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="1000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valid From *
                  </label>
                  <input
                    type="date"
                    value={newPromoCode.validFrom}
                    onChange={(e) => setNewPromoCode(prev => ({ ...prev, validFrom: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valid To *
                  </label>
                  <input
                    type="date"
                    value={newPromoCode.validTo}
                    onChange={(e) => setNewPromoCode(prev => ({ ...prev, validTo: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  checked={newPromoCode.active}
                  onChange={(e) => setNewPromoCode(prev => ({ ...prev, active: e.target.checked }))}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
                  Active
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createPromoCode}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Promo Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromoCodeManager;
