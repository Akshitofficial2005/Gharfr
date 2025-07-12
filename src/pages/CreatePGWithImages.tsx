import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, MapPin, DollarSign, Upload } from 'lucide-react';
import ImageUpload from '../components/Upload/ImageUpload';
import { apiService } from '../utils/api';
import toast from 'react-hot-toast';

const CreatePGWithImages: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: {
      address: '',
      city: '',
      state: '',
      pincode: ''
    },
    roomTypes: [{
      type: 'single',
      price: '',
      deposit: '',
      totalRooms: '',
      availableRooms: ''
    }],
    amenities: {
      wifi: false,
      food: false,
      parking: false,
      gym: false,
      ac: false,
      laundry: false,
      security: false,
      powerBackup: false
    }
  });
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value
        }
      }));
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      if (name.startsWith('amenities.')) {
        const amenity = name.split('.')[1];
        setFormData(prev => ({
          ...prev,
          amenities: {
            ...prev.amenities,
            [amenity]: checked
          }
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRoomTypeChange = (index: number, field: string, value: string) => {
    const updatedRoomTypes = [...formData.roomTypes];
    updatedRoomTypes[index] = { ...updatedRoomTypes[index], [field]: value };
    setFormData(prev => ({ ...prev, roomTypes: updatedRoomTypes }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const pgData = {
        ...formData,
        images: images.map(url => ({ url, isMain: false })),
        roomTypes: formData.roomTypes.map(room => ({
          ...room,
          price: parseInt(room.price),
          deposit: parseInt(room.deposit),
          totalRooms: parseInt(room.totalRooms),
          availableRooms: parseInt(room.availableRooms)
        }))
      };

      // Set first image as main
      if (pgData.images.length > 0) {
        pgData.images[0].isMain = true;
      }

      const response = await apiService.createPG(pgData);
      toast.success('PG created successfully!');
      navigate('/owner/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create PG');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center mb-8">
            <Home className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Add New PG</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">PG Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter PG name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter city"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your PG"
              />
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  name="location.address"
                  value={formData.location.address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter full address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                <input
                  type="text"
                  name="location.pincode"
                  value={formData.location.pincode}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Pincode"
                />
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">PG Images</label>
              <ImageUpload onUpload={setImages} existingImages={images} maxFiles={10} />
            </div>

            {/* Room Type */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Room Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
                  <select
                    value={formData.roomTypes[0].type}
                    onChange={(e) => handleRoomTypeChange(0, 'type', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                    <option value="triple">Triple</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price/Month</label>
                  <input
                    type="number"
                    value={formData.roomTypes[0].price}
                    onChange={(e) => handleRoomTypeChange(0, 'price', e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="₹"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Rooms</label>
                  <input
                    type="number"
                    value={formData.roomTypes[0].totalRooms}
                    onChange={(e) => handleRoomTypeChange(0, 'totalRooms', e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Available</label>
                  <input
                    type="number"
                    value={formData.roomTypes[0].availableRooms}
                    onChange={(e) => handleRoomTypeChange(0, 'availableRooms', e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(formData.amenities).map(([key, value]) => (
                  <label key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      name={`amenities.${key}`}
                      checked={value}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span className="capitalize">{key === 'wifi' ? 'Wi-Fi' : (key || '').replace(/([A-Z])/g, ' $1')}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'Create PG'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePGWithImages;