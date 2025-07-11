# Ghar PG - Student Accommodation Platform

A comprehensive platform for students to find, book, and manage PG accommodations, with features for owners to list and manage properties, and admins to oversee the entire platform.

## 🏠 About Ghar PG

Ghar PG is a modern, feature-rich student accommodation platform that connects students with verified PG owners. The platform provides a seamless experience for browsing, booking, and managing PG accommodations with integrated payment systems, review mechanisms, and administrative tools.

## ✨ Key Features

### For Students
- **Smart Search & Filters**: Advanced search with location, price, amenities, and preferences
- **Detailed PG Listings**: High-quality images, 360° virtual tours, amenities, and reviews
- **Secure Booking System**: Real-time availability, instant booking, and payment processing
- **Review & Rating System**: Share experiences and view authentic reviews
- **Dashboard**: Track bookings, payments, and preferences
- **24/7 Support**: Live chat support and comprehensive help center

### For PG Owners
- **Property Management**: Easy listing creation with media uploads and amenity management
- **Booking Management**: Real-time booking notifications and tenant management
- **Analytics Dashboard**: Revenue tracking, occupancy rates, and performance metrics
- **Communication Tools**: Direct messaging with potential and current tenants
- **Financial Tracking**: Payment history, due amounts, and financial reports

### For Administrators
- **Platform Overview**: Comprehensive analytics and platform health metrics
- **User Management**: User verification, account management, and support
- **Property Moderation**: Listing approval, quality control, and compliance
- **Marketing Tools**: Promo code management and referral program oversight
- **Financial Management**: Transaction monitoring and revenue analytics

## 🛠 Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS for responsive, modern UI
- **State Management**: React Context API
- **Routing**: React Router v6
- **Charts & Analytics**: Chart.js with react-chartjs-2
- **Icons**: Lucide React
- **Build Tool**: Create React App

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```
   The app will open at [http://localhost:3000](http://localhost:3000)

4. **Build for production**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── PGCard.tsx
│   ├── SearchFilters.tsx
│   ├── PromoCodeManager.tsx
│   └── ReferralProgram.tsx
├── contexts/           # React Context providers
│   └── AuthContext.tsx
├── data/              # Mock data and constants
│   ├── mockData.ts
│   └── enhancedMockData.ts
├── pages/             # Main application pages
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Search.tsx
│   ├── PGDetails.tsx
│   ├── OwnerDashboard.tsx
│   ├── AdminDashboard.tsx
│   ├── Support.tsx
│   └── NotFound.tsx
├── types/             # TypeScript type definitions
│   ├── index.ts
│   └── enhanced.ts
└── App.tsx           # Main application component
```

## 🚀 Available Scripts

### Development
- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (irreversible)

### Code Quality
- `npm run lint` - Run ESLint for code quality
- `npm run format` - Format code with Prettier

## 🎯 Core Components

### Authentication System
- JWT-based authentication
- Role-based access control (Student, Owner, Admin)
- Protected routes and components

### Dashboard Analytics
- **Owner Dashboard**: Property performance, booking analytics, revenue tracking
- **Admin Dashboard**: Platform metrics, user growth, financial overview
- Interactive charts and real-time data visualization

### Marketing & Engagement
- **Promo Code Management**: Create, track, and manage promotional campaigns
- **Referral Program**: Built-in referral system with rewards and leaderboards
- Social sharing and viral growth features

### Support System
- Multi-channel support (chat, tickets, FAQ)
- AI-powered chatbot for instant responses
- Comprehensive help center

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_PAYMENT_GATEWAY_KEY=your_payment_key
REACT_APP_MAPS_API_KEY=your_maps_api_key
REACT_APP_ANALYTICS_ID=your_analytics_id
```

### API Integration
The app is designed to work with a RESTful backend API. Update the API endpoints in the services directory to match your backend configuration.

## 🎨 Theming & Customization

The application uses Tailwind CSS for styling. Key customization options:

- **Colors**: Modify `tailwind.config.js` for brand colors
- **Typography**: Customize fonts and text styles
- **Components**: Styled components in `/components` directory
- **Responsive Design**: Mobile-first approach with responsive breakpoints

## 📱 Features in Detail

### Search & Discovery
- Location-based search with map integration
- Advanced filtering (price, amenities, room type)
- Saved searches and favorite listings
- Recommendation engine based on preferences

### Booking Flow
1. Browse and filter listings
2. View detailed property information
3. Check availability and pricing
4. Secure payment processing
5. Booking confirmation and communication

### Payment Integration
- Multiple payment methods (UPI, cards, net banking)
- EMI options for long-term stays
- Secure payment processing
- Automated invoice generation

### Communication
- In-app messaging between students and owners
- Notification system for important updates
- Email and SMS integration
- Video calling for property tours

## 🔒 Security Features

- Data encryption and secure API calls
- Input validation and sanitization
- Protected routes and authentication checks
- Payment security compliance
- Privacy controls and data protection

## 📈 Analytics & Monitoring

- User behavior tracking
- Performance monitoring
- Error logging and reporting
- Business intelligence dashboards
- A/B testing capabilities

## 🚧 Deployment

### Production Build
```bash
npm run build
```

### Deployment Options
- **Netlify**: Connect GitHub repository for automatic deployments
- **Vercel**: Zero-configuration deployment for React apps
- **AWS S3/CloudFront**: Scalable hosting with CDN
- **Docker**: Containerized deployment for any platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support & Contact

- **Documentation**: Check the help center in the app
- **Bug Reports**: Create an issue in the repository
- **Feature Requests**: Open a discussion in the repository
- **Email**: support@gharpg.com
- **Phone**: 1800-XXX-XXXX (24/7 support)

## 🗺 Roadmap

### Upcoming Features
- [ ] Mobile app (React Native)
- [ ] AI-powered room recommendations
- [ ] Virtual reality property tours
- [ ] Blockchain-based payment system
- [ ] IoT integration for smart PGs
- [ ] Multi-language support
- [ ] Advanced analytics and reporting

### Recent Updates
- ✅ Enhanced admin dashboard with analytics
- ✅ Promo code management system
- ✅ Referral program with rewards
- ✅ Improved owner dashboard
- ✅ Advanced type-safe architecture

---

Built with ❤️ for students seeking better accommodation experiences.
