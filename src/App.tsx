import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Header from './components/Header';
import ErrorBoundary from './components/ErrorBoundary';
import LiveChat from './components/LiveChat';
import QuickActions from './components/QuickActions';
// import { registerServiceWorker, handleInstallPrompt } from './utils/pwa';
import { setupGlobalErrorHandler } from './utils/errorHandling';
// import Footer from './components/Footer'; // Removed as requested
import CleanHome from './pages/CleanHome';
import Landing from './pages/Landing';
import AnimatedHomePage from './pages/AnimatedHomePage';
import TermsAndConditions from './pages/TermsAndConditions';
import Search from './pages/Search';
import Login from './pages/Login';
import Register from './pages/Register';
import WorkingRegister from './pages/WorkingRegister';
import CreatePGWithImages from './pages/CreatePGWithImages';
import CompleteBooking from './pages/CompleteBooking';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import PGDetails from './pages/PGDetails';
import Profile from './pages/Profile';
import Bookings from './pages/Bookings';
import Payment from './pages/Payment';
import OwnerDashboard from './pages/OwnerDashboard';
import CreatePG from './pages/CreatePG';
import AdminDashboard from './pages/AdminDashboard';
import AdminPGApproval from './pages/AdminPGApproval';
import AdminAmenities from './pages/AdminAmenities';
import NotFound from './pages/NotFound';
import MapTest from './pages/MapTest';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import ListPG from './pages/ListPG';
import OwnerLogin from './pages/OwnerLogin';
import Pricing from './pages/Pricing';
import ManageListings from './pages/ManageListings';
import PaymentGateway from './pages/PaymentGateway';
import BookingConfirmed from './pages/BookingConfirmed';
import ManageSubscription from './pages/ManageSubscription';
import BookingDetails from './pages/BookingDetails';

// import GoogleLoginTest from './components/GoogleLoginTest';
import SimpleGoogleLogin from './components/SimpleGoogleLogin';
import ProtectedRoute from './components/ProtectedRoute';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  console.log('Checking Environment Variable. API URL is:', process.env.REACT_APP_API_URL);

  useEffect(() => {
    // Initialize PWA features
    // registerServiceWorker(); // Temporarily disabled for Google OAuth debugging
    // handleInstallPrompt(); // Disabled to prevent DOM conflicts with React
    setupGlobalErrorHandler();
  }, []);

  // Ensure Google Client ID is configured for production
  if (!process.env.REACT_APP_GOOGLE_CLIENT_ID || process.env.REACT_APP_GOOGLE_CLIENT_ID === 'your_google_client_id') {
    console.error('Google OAuth Client ID not configured. Please set REACT_APP_GOOGLE_CLIENT_ID');
  }
  
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ""}>
      <QueryClientProvider client={queryClient}>
        <NotificationProvider>
          <AuthProvider>
            <ErrorBoundary>
              <Router>
                <div className="min-h-screen flex flex-col bg-gray-50">
                  <Header />
                  <main className="flex-1 transition-all duration-300 ease-in-out">
                    <Routes>
                  <Route path="/" element={<AnimatedHomePage />} />
                  <Route path="/home" element={<CleanHome />} />
                  <Route path="/landing" element={<Landing />} />
                  <Route path="/animated" element={<AnimatedHomePage />} />
                  <Route path="/terms" element={<TermsAndConditions />} />
                  <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/working-register" element={<WorkingRegister />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/map-test" element={<MapTest />} />
                  <Route path="/social-test" element={<SimpleGoogleLogin />} />
                  <Route path="/pg/:id" element={<PGDetails />} />
                  
                  {/* Public Pages */}
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/list-pg" element={<ListPG />} />
                  <Route path="/owner-login" element={<OwnerLogin />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/manage-listings" element={<ManageListings />} />
                  <Route path="/payment-gateway" element={<PaymentGateway />} />
                  <Route path="/booking-confirmed" element={<BookingConfirmed />} />
                  <Route path="/manage-subscription" element={<ManageSubscription />} />
                  {/* Protected Routes */}
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/bookings" 
                    element={
                      <ProtectedRoute>
                        <Bookings />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/booking/:id" 
                    element={
                      <ProtectedRoute>
                        <BookingDetails />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="/booking-details" element={<BookingDetails />} />
                  <Route 
                    path="/payment/:bookingId" 
                    element={
                      <ProtectedRoute>
                        <Payment />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Owner Routes */}
                  <Route path="/owner-dashboard" element={<OwnerDashboard />} />
                  <Route 
                    path="/owner/dashboard" 
                    element={
                      <ProtectedRoute allowedRoles={['owner']}>
                        <OwnerDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/owner/create-pg" 
                    element={
                      <ProtectedRoute allowedRoles={['owner']}>
                        <CreatePG />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/owner/add-pg" 
                    element={
                      <ProtectedRoute allowedRoles={['owner']}>
                        <CreatePG />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/owner/create-pg-with-images" 
                    element={
                      <ProtectedRoute allowedRoles={['owner']}>
                        <CreatePGWithImages />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="/book/:id" element={<CompleteBooking />} />
                  
                  {/* Admin Routes */}
                  <Route 
                    path="/admin/dashboard" 
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/pg-approval" 
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminPGApproval />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/amenities" 
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminAmenities />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                  {/* <Footer /> Removed as requested */}
                  <LiveChat />
                  <QuickActions />
                  <button
                    id="install-button"
                    style={{ display: 'none' }}
                    className="fixed bottom-20 right-6 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-700 z-40"
                  >
                    Install App
                  </button>
                </div>
                <Toaster 
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#363636',
                      color: '#fff',
                    },
                    success: {
                      duration: 3000,
                      iconTheme: {
                        primary: '#10B981',
                        secondary: '#fff',
                      },
                    },
                    error: {
                      duration: 5000,
                      iconTheme: {
                        primary: '#EF4444',
                        secondary: '#fff',
                      },
                    },
                  }}
                />
              </Router>
            </ErrorBoundary>
          </AuthProvider>
        </NotificationProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
