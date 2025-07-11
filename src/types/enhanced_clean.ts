// Enhanced types for comprehensive PG booking platform

export interface EnhancedFilterOptions {
  location: string;
  nearbyColleges: string[];
  priceRange: { min: number; max: number };
  gender: 'male' | 'female' | 'co-ed' | '';
  roomType: RoomType[];
  amenities: string[];
  furnishing: 'fully-furnished' | 'semi-furnished' | 'unfurnished' | '';
  rating: number;
  distance: number; // in km
  sortBy: 'price' | 'distance' | 'rating' | 'newest';
}

export interface RoomType {
  id: string;
  type: 'single' | 'double' | 'triple' | 'dormitory';
  capacity: number;
  baseRent: number;
  securityDeposit: number;
  availableRooms: number;
  images: string[];
  furnishing: 'fully-furnished' | 'semi-furnished' | 'unfurnished';
  accessories: AccessoryOption[];
}

export interface AccessoryOption {
  id: string;
  name: string;
  type: 'furniture' | 'kitchen' | 'electronics' | 'bedding';
  monthlyRent: number;
  securityDeposit: number;
  description: string;
  image: string;
  available: boolean;
  partner?: string; // Rental partner like Rentomojo
}

export interface EnhancedPG {
  id: string;
  name: string;
  description: string;
  images: string[];
  virtualTourUrl?: string;
  location: {
    address: string;
    area: string;
    city: string;
    pincode: string;
    coordinates: { lat: number; lng: number };
    nearbyColleges: College[];
    landmarks: string[];
  };
  roomTypes: RoomType[];
  amenities: {
    wifi: boolean;
    meals: boolean;
    ac: boolean;
    laundry: boolean;
    parking: boolean;
    security: boolean;
    gym: boolean;
    commonArea: boolean;
    study: boolean;
    powerBackup: boolean;
  };
  policies: {
    entryTiming: string;
    guestPolicy: string;
    smokingAllowed: boolean;
    alcoholAllowed: boolean;
    petsAllowed: boolean;
    noisePolicy: string;
  };
  pricing: {
    monthlyRent: number;
    platformFee: number; // percentage
    gstPercentage: number;
    latePaymentFee: number;
  };
  owner: Owner;
  rating: number;
  reviewCount: number;
  totalReviews: number;
  totalBeds: number;
  verified: boolean;
  gender: 'male' | 'female' | 'co-ed';
  createdAt: string;
  lastUpdated: string;
}

export interface College {
  id: string;
  name: string;
  distance: number; // in km
  type: 'engineering' | 'medical' | 'commerce' | 'arts' | 'other';
}

export interface Owner {
  id: string;
  name: string;
  phone: string;
  email: string;
  verified: boolean;
  rating: number;
  responseTime: string; // e.g., "Usually responds within 1 hour"
  kycStatus: 'pending' | 'verified' | 'rejected';
  joinedDate: string;
}

export interface Booking {
  id: string;
  pgId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  roomTypeId: string;
  roomType: string;
  checkInDate: string;
  checkOutDate?: string;
  monthlyRent: number;
  securityDeposit: number;
  platformFee: number;
  gstAmount: number;
  totalAmount: number;
  accessories: BookedAccessory[];
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'overdue' | 'refunded';
  documents: Document[];
  createdAt: string;
  lastUpdated: string;
}

export interface BookedAccessory {
  accessoryId: string;
  name: string;
  monthlyRent: number;
  securityDeposit: number;
  startDate: string;
  endDate?: string;
}

export interface Document {
  id: string;
  type: 'id_proof' | 'college_id' | 'photo' | 'address_proof';
  url: string;
  verified: boolean;
  uploadedAt: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  college?: College;
  gender: 'male' | 'female';
  dateOfBirth: string;
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  documents: Document[];
  kycStatus: 'pending' | 'verified' | 'rejected';
  preferences: StudentPreferences;
  joinedDate: string;
}

export interface StudentPreferences {
  preferredGender: 'male' | 'female' | 'co-ed';
  maxBudget: number;
  preferredRoomType: 'single' | 'double' | 'triple' | 'dormitory';
  preferredAmenities: string[];
  maxDistance: number; // in km from college
  preferredLocations: string[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  type: 'text' | 'image' | 'document';
  timestamp: string;
  read: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'booking' | 'payment' | 'message' | 'reminder' | 'promotion';
  title: string;
  message: string;
  actionUrl?: string;
  read: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  pgId: string;
  studentId: string;
  studentName: string;
  rating: number;
  comment: string;
  images?: string[];
  categories: {
    cleanliness: number;
    food: number;
    safety: number;
    location: number;
    value: number;
  };
  verified: boolean;
  createdAt: string;
}

export interface PromoCode {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minBookingAmount: number;
  maxDiscount?: number;
  validFrom: string;
  validTo: string;
  usageLimit: number;
  usedCount: number;
  active: boolean;
}

export interface ReferralProgram {
  id: string;
  name: string;
  description: string;
  referrerId: string;
  refereeId: string;
  code: string;
  status: 'pending' | 'completed' | 'expired';
  reward: {
    type: 'cashback' | 'discount' | 'credit';
    amount: number;
  };
  referrerReward: number;
  refereeReward: number;
  minimumBookingAmount: number;
  rewardType: 'cash' | 'credit' | 'discount';
  terms: string[];
  tierBonuses: Array<{
    referrals: number;
    bonus: number;
    description: string;
  }>;
  createdAt: string;
  completedAt?: string;
}

export interface ReferralUser {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  totalReferrals: number;
  successfulReferrals: number;
  totalEarnings: number;
  joinedAt: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}
