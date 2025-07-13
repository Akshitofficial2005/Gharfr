import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { pgAPI } from '../services/api';
import { Upload, MapPin, Wifi, Car, Coffee, Shield, DollarSign, Camera, Plus, X } from 'lucide-react';

interface PGForm {
  name: string;
  description: string;
  location: string;
  pricePerMonth: number;
  totalRooms: number;
  availableRooms: number;
  amenities: string[];
  images: string[];
  contactNumber: string;
  rules: string[];
  roomTypes: Array<{
    type: string;
    price: number;
    capacity: number;
  }>;
}

// Image compression utility
const compressImage = (file: File, maxWidth = 1200, quality = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        const compressedFile = new File([blob!], file.name, {
          type: 'image/jpeg',
          lastModified: Date.now(),
        });
        resolve(compressedFile);
      }, 'image/jpeg', quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

const CreatePG: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState<PGForm>({
    name: '',
    description: '',
    location: '',
    pricePerMonth: 0,
    totalRooms: 0,
    availableRooms: 0,
    amenities: [],
    images: [],
    contactNumber: '',
    rules: [],
    roomTypes: [{ type: 'Single', price: 0, capacity: 1 }]
  });

  // Debug authentication status
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    console.log('CreatePG - Auth Debug:');
    console.log('Token exists:', !!token);
    console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'No token');
    console.log('User exists:', !!user);
    
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        console.log('User role:', parsedUser.role);
        console.log('User ID:', parsedUser._id || parsedUser.id);
        
        if (parsedUser.role !== 'owner' && parsedUser.role !== 'admin') {
          console.log('⚠️ User does not have owner/admin role, attempting to update...');
          
          // Try to automatically update role to owner
          const token = localStorage.getItem('token');
          if (token) {
            fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/auth/update-role`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ role: 'owner' })
            })
            .then(response => response.json())
            .then(result => {
              if (result.user) {
                localStorage.setItem('user', JSON.stringify(result.user));
                console.log('✅ Role updated to owner');
                toast.success('Role updated! You can now create PG listings.');
                window.location.reload();
              }
            })
            .catch(error => {
              console.error('Role update failed:', error);
              toast.error('You need to be an owner or admin to create PG listings');
              navigate('/login');
            });
          } else {
            toast.error('You need to be an owner or admin to create PG listings');
            navigate('/login');
          }
        }
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
        navigate('/login');
      }
    } else {
      console.log('⚠️ No user found in localStorage');
      navigate('/login');
    }
  }, [navigate]);

  const amenityOptions = [
    { id: 'wifi', label: 'Wi-Fi', icon: Wifi },
    { id: 'parking', label: 'Parking', icon: Car },
    { id: 'food', label: 'Food Included', icon: Coffee },
    { id: 'security', label: '24/7 Security', icon: Shield },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'pricePerMonth' || name === 'totalRooms' || name === 'availableRooms' 
        ? Number(value) 
        : value
    }));
  };

  const handleAmenityToggle = (amenityId: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(a => a !== amenityId)
        : [...prev.amenities, amenityId]
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + imageFiles.length > 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }

    try {
      // Compress each image before adding
      const compressedFiles = await Promise.all(
        files.map(file => {
          // Only compress if file is larger than 500KB
          if (file.size > 500000) {
            return compressImage(file);
          }
          return Promise.resolve(file);
        })
      );
      
      setImageFiles(prev => [...prev, ...compressedFiles]);
      toast.success(`${compressedFiles.length} image(s) added and compressed`);
    } catch (error) {
      console.error('Error compressing images:', error);
      toast.error('Error processing images');
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addRule = () => {
    setFormData(prev => ({
      ...prev,
      rules: [...prev.rules, '']
    }));
  };

  const updateRule = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.map((rule, i) => i === index ? value : rule)
    }));
  };

  const removeRule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index)
    }));
  };

  const addRoomType = () => {
    setFormData(prev => ({
      ...prev,
      roomTypes: [...prev.roomTypes, { type: '', price: 0, capacity: 1 }]
    }));
  };

  const updateRoomType = (index: number, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      roomTypes: prev.roomTypes.map((room, i) => 
        i === index ? { ...room, [field]: value } : room
      )
    }));
  };

  const removeRoomType = (index: number) => {
    if (formData.roomTypes.length > 1) {
      setFormData(prev => ({
        ...prev,
        roomTypes: prev.roomTypes.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.location || !formData.pricePerMonth) {
      toast.error('Please fill all required fields');
      return;
    }

    if (imageFiles.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      
      // Append basic fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'amenities' && key !== 'rules' && key !== 'roomTypes' && key !== 'images') {
          submitData.append(key, value.toString());
        }
      });

      // Append arrays as JSON strings
      submitData.append('amenities', JSON.stringify(formData.amenities));
      submitData.append('rules', JSON.stringify(formData.rules.filter(rule => rule.trim())));
      submitData.append('roomTypes', JSON.stringify(formData.roomTypes));

      // Append images with size validation
      let totalSize = 0;
      imageFiles.forEach((file) => {
        totalSize += file.size;
        submitData.append('images', file);
      });

      // Log payload size for debugging
      console.log(`Total payload size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
      
      if (totalSize > 45 * 1024 * 1024) { // 45MB limit with buffer
        toast.error('Images too large. Please reduce image quality or count.');
        return;
      }

      // Debug before API call
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      console.log('PG Submit - Auth status:');
      console.log('Token exists:', !!token);
      console.log('User exists:', !!user);
      if (user) {
        const parsedUser = JSON.parse(user);
        console.log('User role for submission:', parsedUser.role);
      }

      console.log('Creating PG with API call...');
      await pgAPI.createPG(submitData);
      toast.success('PG listing created successfully!');
      navigate('/owner-dashboard');
    } catch (error) {
      console.error('Error creating PG:', error);
      toast.error('Failed to create PG listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New PG Listing</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                PG Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="City, Area"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="pricePerMonth" className="block text-sm font-medium text-gray-700 mb-2">
                Price per Month (₹) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="number"
                  id="pricePerMonth"
                  name="pricePerMonth"
                  value={formData.pricePerMonth}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number
              </label>
              <input
                type="tel"
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="totalRooms" className="block text-sm font-medium text-gray-700 mb-2">
                Total Rooms
              </label>
              <input
                type="number"
                id="totalRooms"
                name="totalRooms"
                value={formData.totalRooms}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>

            <div>
              <label htmlFor="availableRooms" className="block text-sm font-medium text-gray-700 mb-2">
                Available Rooms
              </label>
              <input
                type="number"
                id="availableRooms"
                name="availableRooms"
                value={formData.availableRooms}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                max={formData.totalRooms}
              />
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your PG..."
            />
          </div>
        </div>

        {/* Amenities */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {amenityOptions.map(({ id, label, icon: Icon }) => (
              <label
                key={id}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                  formData.amenities.includes(id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.amenities.includes(id)}
                  onChange={() => handleAmenityToggle(id)}
                  className="sr-only"
                />
                <Icon className="w-5 h-5 mr-2 text-gray-600" />
                <span className="text-sm font-medium">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Room Types */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Room Types</h2>
            <button
              type="button"
              onClick={addRoomType}
              className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Room Type
            </button>
          </div>

          {formData.roomTypes.map((room, index) => (
            <div key={index} className="flex items-center space-x-4 mb-4">
              <input
                type="text"
                placeholder="Room type (e.g., Single, Double)"
                value={room.type}
                onChange={(e) => updateRoomType(index, 'type', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Price"
                value={room.price}
                onChange={(e) => updateRoomType(index, 'price', Number(e.target.value))}
                className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
              <input
                type="number"
                placeholder="Capacity"
                value={room.capacity}
                onChange={(e) => updateRoomType(index, 'capacity', Number(e.target.value))}
                className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
              />
              {formData.roomTypes.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRoomType(index)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Images */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Images</h2>
          
          <div className="mb-4">
            <label className="flex items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400">
              <div className="text-center">
                <Camera className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">Click to upload images</p>
                <p className="text-xs text-gray-500">PNG, JPG up to 10 images</p>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          {imageFiles.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {imageFiles.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rules */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Rules & Regulations</h2>
            <button
              type="button"
              onClick={addRule}
              className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Rule
            </button>
          </div>

          {formData.rules.map((rule, index) => (
            <div key={index} className="flex items-center space-x-4 mb-3">
              <input
                type="text"
                placeholder="Enter a rule or regulation"
                value={rule}
                onChange={(e) => updateRule(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => removeRule(index)}
                className="p-2 text-red-600 hover:text-red-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/owner-dashboard')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Creating...' : 'Create PG Listing'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePG;
