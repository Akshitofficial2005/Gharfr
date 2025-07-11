// Enhanced mock data for comprehensive PG booking platform

import { EnhancedPG, College, Student, Booking, Review, Notification } from '../types/enhanced';

export const mockColleges: College[] = [
  { id: '1', name: 'SGSITS (SATI)', distance: 0, type: 'engineering' },
  { id: '2', name: 'IIT Indore', distance: 0, type: 'engineering' },
  { id: '3', name: 'IIPS Indore', distance: 0, type: 'medical' },
  { id: '4', name: 'DAVV University', distance: 0, type: 'commerce' },
  { id: '5', name: 'Medicaps University', distance: 0, type: 'engineering' },
  { id: '6', name: 'Acropolis Institute', distance: 0, type: 'engineering' },
  { id: '7', name: 'Prestige Institute', distance: 0, type: 'commerce' },
  { id: '8', name: 'IIM Indore', distance: 0, type: 'commerce' },
];

export const mockEnhancedPGs: EnhancedPG[] = [
  {
    id: '1',
    name: 'Green Valley Boys Hostel',
    description: 'Modern and comfortable accommodation for engineering students with all essential amenities.',
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop'
    ],
    virtualTourUrl: 'https://example.com/virtual-tour/1',
    location: {
      address: 'Sector 7, Vijay Nagar',
      area: 'Vijay Nagar',
      city: 'Indore',
      pincode: '452010',
      coordinates: { lat: 22.7532, lng: 75.8937 },
      nearbyColleges: [
        { id: '1', name: 'SGSITS (SATI)', distance: 2.5, type: 'engineering' },
        { id: '5', name: 'Medicaps University', distance: 1.8, type: 'engineering' },
      ],
      landmarks: ['Treasure Island Mall', 'Vijay Nagar Square', 'Apollo Hospital']
    },
    roomTypes: [
      {
        id: 'r1-single',
        type: 'single',
        capacity: 1,
        baseRent: 12000,
        securityDeposit: 15000,
        availableRooms: 5,
        images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop'],
        furnishing: 'fully-furnished',
        accessories: [
          {
            id: 'acc-1',
            name: 'Study Table & Chair',
            type: 'furniture',
            monthlyRent: 500,
            securityDeposit: 1000,
            description: 'Ergonomic study table with chair',
            image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop',
            available: true,
            partner: 'Rentomojo'
          },
          {
            id: 'acc-2',
            name: 'Mini Fridge',
            type: 'electronics',
            monthlyRent: 800,
            securityDeposit: 2000,
            description: '120L mini refrigerator',
            image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=300&h=200&fit=crop',
            available: true,
            partner: 'Rentomojo'
          }
        ]
      },
      {
        id: 'r1-double',
        type: 'double',
        capacity: 2,
        baseRent: 8500,
        securityDeposit: 10000,
        availableRooms: 8,
        images: ['https://images.unsplash.com/photo-1631049035182-249067d7618e?w=600&h=400&fit=crop'],
        furnishing: 'semi-furnished',
        accessories: []
      }
    ],
    amenities: {
      wifi: true,
      meals: true,
      ac: true,
      laundry: true,
      parking: true,
      security: true,
      gym: false,
      commonArea: true,
      study: true,
      powerBackup: true
    },
    policies: {
      entryTiming: '6:00 AM - 11:00 PM',
      guestPolicy: 'Allowed with prior permission',
      smokingAllowed: false,
      alcoholAllowed: false,
      petsAllowed: false,
      noisePolicy: 'No loud music after 10 PM'
    },
    pricing: {
      monthlyRent: 12000,
      platformFee: 2.5,
      gstPercentage: 18,
      latePaymentFee: 500
    },
    owner: {
      id: 'o1',
      name: 'Rajesh Kumar',
      phone: '9876543210',
      email: 'rajesh@example.com',
      verified: true,
      rating: 4.5,
      responseTime: 'Usually responds within 2 hours',
      kycStatus: 'verified',
      joinedDate: '2023-01-15'
    },
    rating: 4.3,
    reviewCount: 47,
    totalReviews: 47,
    totalBeds: 24,
    verified: true,
    gender: 'male',
    createdAt: '2023-01-15T00:00:00Z',
    lastUpdated: '2024-12-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Rose Garden Girls Hostel',
    description: 'Safe and secure accommodation for female students with modern facilities.',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop'
    ],
    virtualTourUrl: 'https://example.com/virtual-tour/2',
    location: {
      address: 'Scheme 54, Bhanwarkuan',
      area: 'Bhanwarkuan',
      city: 'Indore',
      pincode: '452014',
      coordinates: { lat: 22.6969, lng: 75.8669 },
      nearbyColleges: [
        { id: '3', name: 'IIPS Indore', distance: 1.2, type: 'medical' },
        { id: '6', name: 'Acropolis Institute', distance: 3.5, type: 'engineering' },
      ],
      landmarks: ['Palasia Square', 'Central Mall', 'City Hospital']
    },
    roomTypes: [
      {
        id: 'r2-single',
        type: 'single',
        capacity: 1,
        baseRent: 14000,
        securityDeposit: 18000,
        availableRooms: 3,
        images: ['https://images.unsplash.com/photo-1631049035182-249067d7618e?w=600&h=400&fit=crop'],
        furnishing: 'fully-furnished',
        accessories: []
      },
      {
        id: 'r2-triple',
        type: 'triple',
        capacity: 3,
        baseRent: 6500,
        securityDeposit: 8000,
        availableRooms: 6,
        images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop'],
        furnishing: 'semi-furnished',
        accessories: []
      }
    ],
    amenities: {
      wifi: true,
      meals: true,
      ac: false,
      laundry: true,
      parking: false,
      security: true,
      gym: true,
      commonArea: true,
      study: true,
      powerBackup: true
    },
    policies: {
      entryTiming: '6:00 AM - 10:00 PM',
      guestPolicy: 'Female guests only with ID',
      smokingAllowed: false,
      alcoholAllowed: false,
      petsAllowed: false,
      noisePolicy: 'Quiet hours after 9 PM'
    },
    pricing: {
      monthlyRent: 14000,
      platformFee: 2.5,
      gstPercentage: 18,
      latePaymentFee: 500
    },
    owner: {
      id: 'o2',
      name: 'Sunita Sharma',
      phone: '9876543211',
      email: 'sunita@example.com',
      verified: true,
      rating: 4.7,
      responseTime: 'Usually responds within 1 hour',
      kycStatus: 'verified',
      joinedDate: '2023-03-20'
    },
    rating: 4.6,
    reviewCount: 32,
    totalReviews: 32,
    totalBeds: 18,
    verified: true,
    gender: 'female',
    createdAt: '2023-03-20T00:00:00Z',
    lastUpdated: '2024-11-28T00:00:00Z'
  },
  {
    id: '3',
    name: 'Unity Co-living Space',
    description: 'Modern co-living space for students of all genders with premium amenities.',
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1631049035182-249067d7618e?w=800&h=600&fit=crop'
    ],
    virtualTourUrl: 'https://example.com/virtual-tour/3',
    location: {
      address: 'Silicon City, Rau',
      area: 'Rau',
      city: 'Indore',
      pincode: '453331',
      coordinates: { lat: 22.6726, lng: 75.8449 },
      nearbyColleges: [
        { id: '2', name: 'IIT Indore', distance: 1.5, type: 'engineering' },
        { id: '8', name: 'IIM Indore', distance: 2.0, type: 'commerce' },
      ],
      landmarks: ['Rau Circle', 'ISBT Rau', 'Country Club']
    },
    roomTypes: [
      {
        id: 'r3-single',
        type: 'single',
        capacity: 1,
        baseRent: 18000,
        securityDeposit: 25000,
        availableRooms: 4,
        images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop'],
        furnishing: 'fully-furnished',
        accessories: [
          {
            id: 'acc-3',
            name: 'Premium Mattress',
            type: 'bedding',
            monthlyRent: 300,
            securityDeposit: 500,
            description: 'Memory foam mattress',
            image: 'https://images.unsplash.com/photo-1631049035182-249067d7618e?w=300&h=200&fit=crop',
            available: true,
            partner: 'Rentomojo'
          }
        ]
      },
      {
        id: 'r3-double',
        type: 'double',
        capacity: 2,
        baseRent: 12000,
        securityDeposit: 15000,
        availableRooms: 6,
        images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop'],
        furnishing: 'fully-furnished',
        accessories: []
      }
    ],
    amenities: {
      wifi: true,
      meals: true,
      ac: true,
      laundry: true,
      parking: true,
      security: true,
      gym: true,
      commonArea: true,
      study: true,
      powerBackup: true
    },
    policies: {
      entryTiming: '24/7 Access',
      guestPolicy: 'Allowed with registration',
      smokingAllowed: false,
      alcoholAllowed: false,
      petsAllowed: true,
      noisePolicy: 'Respectful noise levels'
    },
    pricing: {
      monthlyRent: 18000,
      platformFee: 3.0,
      gstPercentage: 18,
      latePaymentFee: 750
    },
    owner: {
      id: 'o3',
      name: 'Modern Living Pvt Ltd',
      phone: '9876543212',
      email: 'contact@modernliving.com',
      verified: true,
      rating: 4.8,
      responseTime: 'Usually responds within 30 minutes',
      kycStatus: 'verified',
      joinedDate: '2023-06-10'
    },
    rating: 4.8,
    reviewCount: 89,
    totalReviews: 89,
    totalBeds: 20,
    verified: true,
    gender: 'co-ed',
    createdAt: '2023-06-10T00:00:00Z',
    lastUpdated: '2024-12-01T00:00:00Z'
  }
];

export const mockStudents: Student[] = [
  {
    id: 's1',
    name: 'Arjun Patel',
    email: 'arjun@example.com',
    phone: '9876543213',
    college: { id: '1', name: 'SGSITS (SATI)', distance: 0, type: 'engineering' },
    gender: 'male',
    dateOfBirth: '2003-05-15',
    emergencyContact: {
      name: 'Ramesh Patel',
      phone: '9876543214',
      relation: 'Father'
    },
    documents: [],
    kycStatus: 'verified',
    preferences: {
      preferredGender: 'male',
      maxBudget: 15000,
      preferredRoomType: 'single',
      preferredAmenities: ['wifi', 'meals', 'ac'],
      maxDistance: 5,
      preferredLocations: ['Vijay Nagar', 'Scheme 54']
    },
    joinedDate: '2024-01-15'
  }
];

export const mockBookings: Booking[] = [
  {
    id: 'b1',
    pgId: '1',
    studentId: 's1',
    studentName: 'John Doe',
    studentEmail: 'john@example.com',
    roomTypeId: 'r1-single',
    roomType: 'Single',
    checkInDate: '2024-07-01',
    monthlyRent: 12000,
    totalAmount: 29714,
    securityDeposit: 15000,
    platformFee: 300,
    gstAmount: 2214,
    accessories: [
      {
        accessoryId: 'acc-1',
        name: 'Study Table & Chair',
        monthlyRent: 500,
        securityDeposit: 1000,
        startDate: '2024-07-01'
      }
    ],
    status: 'active',
    paymentStatus: 'paid',
    documents: [],
    createdAt: '2024-06-15T00:00:00Z',
    lastUpdated: '2024-07-01T00:00:00Z'
  }
];

export const mockReviews: Review[] = [
  {
    id: 'rev1',
    pgId: '1',
    studentId: 's1',
    studentName: 'John Doe',
    rating: 4,
    comment: 'Great place with good facilities. The owner is very responsive and helpful.',
    categories: {
      cleanliness: 4,
      food: 4,
      safety: 5,
      location: 4,
      value: 4
    },
    verified: true,
    createdAt: '2024-09-15T00:00:00Z'
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    userId: 's1',
    type: 'payment',
    title: 'Rent Due Reminder',
    message: 'Your monthly rent of ₹12,500 is due on July 1st. Pay now to avoid late fees.',
    actionUrl: '/payments',
    read: false,
    createdAt: '2024-06-25T00:00:00Z'
  },
  {
    id: 'n2',
    userId: 's1',
    type: 'booking',
    title: 'Booking Confirmed',
    message: 'Your booking at Green Valley Boys Hostel has been confirmed for July 1st.',
    actionUrl: '/bookings/b1',
    read: true,
    createdAt: '2024-06-15T10:30:00Z'
  }
];