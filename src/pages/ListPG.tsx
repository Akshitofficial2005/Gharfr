import React, { useState } from 'react';
import { Upload, MapPin, Camera, Plus, X, Home, Users, Wifi, Car, Utensils, Shield, Zap, Dumbbell } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { ownerAPIService } from '../services/ownerAPI';
import { ApiResponse } from '../types/api';

const ListPG: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Info
    pgName: '',
    description: '',
    ownerName: '',
    ownerPhone: '',
    ownerEmail: '',
    
    // Location
    address: '',
    city: '',
    state: '',
    pincode: '',
    nearbyLandmarks: '',
    
    // Property Details
    totalRooms: '',
    pgType: 'boys', // boys, girls, co-ed
    furnishing: 'fully-furnished',
    
    // Room Types
    roomTypes: [
      { type: 'single', price: '', available: '', deposit: '' }
    ],
    
    // Amenities
    amenities: {
      wifi: false,
      meals: false,
      ac: false,
      laundry: false,
      parking: false,
      gym: false,
      security: false,
      powerBackup: false
    },
    
    // Rules
    rules: [''],
    
    // Images
    images: [] as string[],
    
    // Location
    latitude: '',
    longitude: '',
    mapUrl: ''
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAmenityChange = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [amenity]: !prev.amenities[amenity as keyof typeof prev.amenities]
      }
    }));
  };

  const addRoomType = () => {
    setFormData(prev => ({
      ...prev,
      roomTypes: [...prev.roomTypes, { type: 'double', price: '', available: '', deposit: '' }]
    }));
  };

  const removeRoomType = (index: number) => {
    setFormData(prev => ({
      ...prev,
      roomTypes: prev.roomTypes.filter((_, i) => i !== index)
    }));
  };

  const addRule = () => {
    setFormData(prev => ({
      ...prev,
      rules: [...prev.rules, '']
    }));
  };

  const removeRule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, event.target?.result as string]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await ownerAPIService.createPG(formData as any) as ApiResponse;
      
      if (response.success) {
        toast.success('PG listing submitted successfully! Redirecting to dashboard...');
        setTimeout(() => {
          navigate('/owner-dashboard');
        }, 2000);
      } else {
        throw new Error(response.message || 'Failed to submit listing');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">List Your PG</h1>
          <p className="text-gray-600 mt-2">Join thousands of PG owners on Ghar platform</p>
          
          {/* Progress Steps */}
          <div className="mt-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step}
                  </div>
                  {step < 5 && (
                    <div className={`w-16 h-1 mx-2 ${
                      currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-600">
              <span>Basic Info</span>
              <span>Property Details</span>
              <span>Photos & Location</span>
              <span>Amenities & Rules</span>
              <span>Review & Submit</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit}>
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PG Name *
                  </label>
                  <input
                    type="text"
                    value={formData.pgName}
                    onChange={(e) => handleInputChange('pgName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter PG name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Owner Name *
                  </label>
                  <input
                    type="text"
                    value={formData.ownerName}
                    onChange={(e) => handleInputChange('ownerName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter owner name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.ownerPhone}
                    onChange={(e) => handleInputChange('ownerPhone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter phone number"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.ownerEmail}
                    onChange={(e) => handleInputChange('ownerEmail', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter email address"
                    required
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your PG, its features, and what makes it special..."
                  required
                />
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Complete Address *
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter complete address with landmarks"
                  required
                />
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="City"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="State"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Pincode"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Property Details */}
          {currentStep === 2 && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Property Details</h2>
              
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Rooms *
                  </label>
                  <input
                    type="number"
                    value={formData.totalRooms}
                    onChange={(e) => handleInputChange('totalRooms', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Total number of rooms"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PG Type *
                  </label>
                  <select
                    value={formData.pgType}
                    onChange={(e) => handleInputChange('pgType', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="boys">Boys Only</option>
                    <option value="girls">Girls Only</option>
                    <option value="co-ed">Co-ed</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Furnishing *
                  </label>
                  <select
                    value={formData.furnishing}
                    onChange={(e) => handleInputChange('furnishing', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="fully-furnished">Fully Furnished</option>
                    <option value="semi-furnished">Semi Furnished</option>
                    <option value="unfurnished">Unfurnished</option>
                  </select>
                </div>
              </div>
              
              {/* Room Types */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Room Types & Pricing</h3>
                  <button
                    type="button"
                    onClick={addRoomType}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Room Type
                  </button>
                </div>
                
                {formData.roomTypes.map((room, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium text-gray-900">Room Type {index + 1}</h4>
                      {formData.roomTypes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRoomType(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Room Type
                        </label>
                        <select
                          value={room.type}
                          onChange={(e) => {
                            const newRoomTypes = [...formData.roomTypes];
                            newRoomTypes[index].type = e.target.value;
                            handleInputChange('roomTypes', newRoomTypes);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="single">Single</option>
                          <option value="double">Double Sharing</option>
                          <option value="triple">Triple Sharing</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Monthly Rent (₹)
                        </label>
                        <input
                          type="number"
                          value={room.price}
                          onChange={(e) => {
                            const newRoomTypes = [...formData.roomTypes];
                            newRoomTypes[index].price = e.target.value;
                            handleInputChange('roomTypes', newRoomTypes);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="15000"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Available Rooms
                        </label>
                        <input
                          type="number"
                          value={room.available}
                          onChange={(e) => {
                            const newRoomTypes = [...formData.roomTypes];
                            newRoomTypes[index].available = e.target.value;
                            handleInputChange('roomTypes', newRoomTypes);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="5"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Security Deposit (₹)
                        </label>
                        <input
                          type="number"
                          value={room.deposit}
                          onChange={(e) => {
                            const newRoomTypes = [...formData.roomTypes];
                            newRoomTypes[index].deposit = e.target.value;
                            handleInputChange('roomTypes', newRoomTypes);
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="15000"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Photos & Location */}
          {currentStep === 3 && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Photos & Location</h2>
              
              {/* Photo Upload */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Room Photos</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Upload photos</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                  </div>
                </div>
                
                {/* Image Preview */}
                {formData.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Room ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Google Maps Location */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Details</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Latitude
                    </label>
                    <input
                      type="text"
                      value={formData.latitude}
                      onChange={(e) => handleInputChange('latitude', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="12.9716"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Longitude
                    </label>
                    <input
                      type="text"
                      value={formData.longitude}
                      onChange={(e) => handleInputChange('longitude', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="77.5946"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Google Maps URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.mapUrl}
                    onChange={(e) => handleInputChange('mapUrl', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://maps.google.com/..."
                  />
                </div>
                
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">How to get coordinates:</h4>
                  <ol className="text-sm text-blue-800 space-y-1">
                    <li>1. Open Google Maps</li>
                    <li>2. Right-click on your PG location</li>
                    <li>3. Click on the coordinates that appear</li>
                    <li>4. Copy and paste latitude and longitude</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Amenities & Rules */}
          {currentStep === 4 && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Amenities & Rules</h2>
              
              {/* Amenities */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Amenities</h3>
                <div className="grid md:grid-cols-4 gap-4">
                  {[
                    { key: 'wifi', label: 'Wi-Fi', icon: Wifi },
                    { key: 'meals', label: 'Meals', icon: Utensils },
                    { key: 'ac', label: 'AC', icon: Zap },
                    { key: 'laundry', label: 'Laundry', icon: Shield },
                    { key: 'parking', label: 'Parking', icon: Car },
                    { key: 'gym', label: 'Gym', icon: Dumbbell },
                    { key: 'security', label: '24/7 Security', icon: Shield },
                    { key: 'powerBackup', label: 'Power Backup', icon: Zap }
                  ].map((amenity) => {
                    const Icon = amenity.icon;
                    return (
                      <label key={amenity.key} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.amenities[amenity.key as keyof typeof formData.amenities]}
                          onChange={() => handleAmenityChange(amenity.key)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <Icon className="w-5 h-5 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">{amenity.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
              
              {/* Rules */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">House Rules</h3>
                  <button
                    type="button"
                    onClick={addRule}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Rule
                  </button>
                </div>
                
                {formData.rules.map((rule, index) => (
                  <div key={index} className="flex items-center space-x-3 mb-3">
                    <input
                      type="text"
                      value={rule}
                      onChange={(e) => {
                        const newRules = [...formData.rules];
                        newRules[index] = e.target.value;
                        handleInputChange('rules', newRules);
                      }}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter house rule..."
                    />
                    {formData.rules.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRule(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Review & Submit */}
          {currentStep === 5 && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Review & Submit</h2>
              
              <div className="space-y-6">
                {/* Basic Info Summary */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div><strong>PG Name:</strong> {formData.pgName}</div>
                    <div><strong>Owner:</strong> {formData.ownerName}</div>
                    <div><strong>Phone:</strong> {formData.ownerPhone}</div>
                    <div><strong>Email:</strong> {formData.ownerEmail}</div>
                    <div className="md:col-span-2"><strong>Address:</strong> {formData.address}</div>
                  </div>
                </div>
                
                {/* Property Details Summary */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Property Details</h3>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div><strong>Total Rooms:</strong> {formData.totalRooms}</div>
                    <div><strong>PG Type:</strong> {formData.pgType}</div>
                    <div><strong>Furnishing:</strong> {formData.furnishing}</div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Room Types:</h4>
                    {formData.roomTypes.map((room, index) => (
                      <div key={index} className="text-sm text-gray-600 mb-1">
                        {room.type} - ₹{room.price}/month, {room.available} available, ₹{room.deposit} deposit
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Amenities Summary */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(formData.amenities)
                      .filter(([_, value]) => value)
                      .map(([key, _]) => (
                        <span key={key} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </span>
                      ))}
                  </div>
                </div>
                
                {/* Rules Summary */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">House Rules</h3>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {formData.rules.filter(rule => rule.trim()).map((rule, index) => (
                      <li key={index}>{rule}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Next Steps:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Your listing will be reviewed within 2-3 business days</li>
                  <li>• You'll receive an email confirmation once approved</li>
                  <li>• You can manage your listing from the Owner Dashboard</li>
                  <li>• Start receiving inquiries from potential tenants</li>
                </ul>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {currentStep < 5 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next Step
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  'Submit Listing'
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ListPG;