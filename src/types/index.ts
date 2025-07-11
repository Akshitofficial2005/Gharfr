export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'owner' | 'admin';
  gender?: 'male' | 'female';
  avatar?: string;
  createdAt: Date;
}

export interface PG {
  id: string;
  name: string;
  description: string;
  images: string[];
  location: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  amenities: {
    wifi: boolean;
    food: boolean;
    laundry: boolean;
    parking: boolean;
    gym: boolean;
    ac: boolean;
    powerBackup: boolean;
    security: boolean;
  };
  roomTypes: RoomType[];
  extraAmenities: ExtraAmenity[];
  rules: string[];
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  rating: number;
  reviewCount: number;
  isApproved: boolean;
  gender?: 'male' | 'female' | 'both';
  createdAt: Date;
  updatedAt: Date;
}

export interface RoomType {
  id: string;
  type: 'single' | 'double' | 'triple' | 'dormitory';
  price: number;
  deposit: number;
  availableRooms: number;
  totalRooms: number;
  amenities: string[];
  extraAmenities?: ExtraAmenity[];
  images: string[];
  gender?: 'male' | 'female' | 'both';
}

export interface ExtraAmenity {
  id: string;
  name: string;
  description: string;
  monthlyCharge: number; // per month
  icon?: string;
}

export interface Booking {
  id: string;
  userId: string;
  pgId: string;
  roomTypeId: string;
  checkInDate: Date;
  checkOutDate?: Date;
  duration: number; // in months
  totalAmount: number;
  baseAmount: number;
  extraAmenitiesAmount: number;
  selectedExtraAmenities?: {[key: string]: number};
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  userId: string;
  pgId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  userName: string;
  userAvatar?: string;
}

export interface FilterOptions {
  location: string;
  priceRange: {
    min: number;
    max: number;
  };
  roomType: string[];
  amenities: string[];
  rating: number;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'user' | 'owner';
  gender?: 'male' | 'female';
}

export interface LoginData {
  email: string;
  password: string;
}