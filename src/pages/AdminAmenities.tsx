import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface Amenity {
  id: string;
  name: string;
  description: string;
  monthlyCharge: number;
  icon: string;
  category: 'basic' | 'premium' | 'luxury';
  isActive: boolean;
}

const AdminAmenities: React.FC = () => {
  const [amenities, setAmenities] = useState<Amenity[]>([
    {
      id: '1',
      name: 'Air Conditioning',
      description: 'Personal AC in room',
      monthlyCharge: 2000,
      icon: '❄️',
      category: 'premium',
      isActive: true
    },
    {
      id: '2',
      name: 'Mini Fridge',
      description: 'Personal refrigerator',
      monthlyCharge: 1500,
      icon: '🧊',
      category: 'premium',
      isActive: true
    }
  ]);

  const [editingAmenity, setEditingAmenity] = useState<Amenity | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAmenity, setNewAmenity] = useState<Omit<Amenity, 'id'>>({
    name: '',
    description: '',
    monthlyCharge: 0,
    icon: '',
    category: 'basic',
    isActive: true
  });

  const handleSaveAmenity = () => {
    if (editingAmenity) {
      setAmenities(prev => 
        prev.map(a => a.id === editingAmenity.id ? editingAmenity : a)
      );
      setEditingAmenity(null);
      toast.success('Amenity updated successfully');
    }
  };

  const handleAddAmenity = () => {
    if (!newAmenity.name || !newAmenity.description) {
      toast.error('Please fill all required fields');
      return;
    }

    const amenity: Amenity = {
      ...newAmenity,
      id: Date.now().toString()
    };

    setAmenities(prev => [...prev, amenity]);
    setNewAmenity({
      name: '',
      description: '',
      monthlyCharge: 0,
      icon: '',
      category: 'basic',
      isActive: true
    });
    setShowAddForm(false);
    toast.success('Amenity added successfully');
  };

  const handleDeleteAmenity = (id: string) => {
    if (window.confirm('Are you sure you want to delete this amenity?')) {
      setAmenities(prev => prev.filter(a => a.id !== id));
      toast.success('Amenity deleted successfully');
    }
  };

  const toggleAmenityStatus = (id: string) => {
    setAmenities(prev =>
      prev.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a)
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Amenities Management</h1>
            <p className="text-gray-600 mt-2">Manage additional amenities available for PGs</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Amenity
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {amenities.map((amenity) => (
            <div key={amenity.id} className="bg-white rounded-lg shadow p-6">
              {editingAmenity?.id === amenity.id ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editingAmenity.name}
                    onChange={(e) => setEditingAmenity({...editingAmenity, name: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Amenity name"
                  />
                  <textarea
                    value={editingAmenity.description}
                    onChange={(e) => setEditingAmenity({...editingAmenity, description: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Description"
                    rows={2}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={editingAmenity.monthlyCharge}
                      onChange={(e) => setEditingAmenity({...editingAmenity, monthlyCharge: parseInt(e.target.value)})}
                      className="px-3 py-2 border rounded-lg"
                      placeholder="Monthly charge"
                    />
                    <input
                      type="text"
                      value={editingAmenity.icon}
                      onChange={(e) => setEditingAmenity({...editingAmenity, icon: e.target.value})}
                      className="px-3 py-2 border rounded-lg"
                      placeholder="Icon"
                    />
                  </div>
                  <select
                    value={editingAmenity.category}
                    onChange={(e) => setEditingAmenity({...editingAmenity, category: e.target.value as any})}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="basic">Basic</option>
                    <option value="premium">Premium</option>
                    <option value="luxury">Luxury</option>
                  </select>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveAmenity}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 flex items-center justify-center"
                    >
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </button>
                    <button
                      onClick={() => setEditingAmenity(null)}
                      className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 flex items-center justify-center"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{amenity.icon}</span>
                      <h3 className="font-semibold text-gray-900">{amenity.name}</h3>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => setEditingAmenity(amenity)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAmenity(amenity.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-3">{amenity.description}</p>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-blue-600">
                      ₹{amenity.monthlyCharge.toLocaleString()}/month
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      amenity.category === 'basic' ? 'bg-green-100 text-green-800' :
                      amenity.category === 'premium' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {amenity.category}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Status:</span>
                    <button
                      onClick={() => toggleAmenityStatus(amenity.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        amenity.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {amenity.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Add Amenity Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Add New Amenity</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  value={newAmenity.name}
                  onChange={(e) => setNewAmenity({...newAmenity, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Amenity name *"
                />
                <textarea
                  value={newAmenity.description}
                  onChange={(e) => setNewAmenity({...newAmenity, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Description *"
                  rows={3}
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={newAmenity.monthlyCharge}
                    onChange={(e) => setNewAmenity({...newAmenity, monthlyCharge: parseInt(e.target.value) || 0})}
                    className="px-3 py-2 border rounded-lg"
                    placeholder="Monthly charge"
                  />
                  <input
                    type="text"
                    value={newAmenity.icon}
                    onChange={(e) => setNewAmenity({...newAmenity, icon: e.target.value})}
                    className="px-3 py-2 border rounded-lg"
                    placeholder="Icon (emoji)"
                  />
                </div>
                <select
                  value={newAmenity.category}
                  onChange={(e) => setNewAmenity({...newAmenity, category: e.target.value as any})}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="basic">Basic</option>
                  <option value="premium">Premium</option>
                  <option value="luxury">Luxury</option>
                </select>

                <div className="flex space-x-3">
                  <button
                    onClick={handleAddAmenity}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                  >
                    Add Amenity
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAmenities;