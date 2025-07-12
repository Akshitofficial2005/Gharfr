import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Shield, Users, CreditCard, Home } from 'lucide-react';

const TermsAndConditions: React.FC = () => {
  const navigate = useNavigate();

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-8"
          {...fadeInUp}
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          
          <div className="flex items-center mb-4">
            <FileText className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Terms & Conditions</h1>
          </div>
          
          <p className="text-gray-600 text-lg">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </motion.div>

        {/* Terms Content */}
        <motion.div 
          className="bg-white rounded-2xl shadow-xl p-8 space-y-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="w-6 h-6 text-blue-600 mr-2" />
              Welcome to Ghar
            </h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms and Conditions ("Terms", "Terms and Conditions") govern your relationship with 
              Ghar PG booking platform operated by Ghar ("us", "we", or "our"). Please read these Terms 
              and Conditions carefully before using our Service.
            </p>
          </section>

          {/* Acceptance */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h3>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using this website, you accept and agree to be bound by the terms and 
              provision of this agreement. If you do not agree to abide by the above, please do not 
              use this service.
            </p>
          </section>

          {/* User Accounts */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
              <Users className="w-5 h-5 text-blue-600 mr-2" />
              2. User Accounts
            </h3>
            <div className="space-y-3 text-gray-700">
              <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times.</p>
              <p>You are responsible for safeguarding the password and for any activities that occur under your account.</p>
              <p>You agree not to disclose your password to any third party and to take sole responsibility for any activities under your account.</p>
            </div>
          </section>

          {/* Property Listings */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
              <Home className="w-5 h-5 text-blue-600 mr-2" />
              3. Property Listings
            </h3>
            <div className="space-y-3 text-gray-700">
              <p><strong>For Property Owners:</strong></p>
              <ul className="list-disc pl-6 space-y-2">
                <li>All property listings must be accurate and truthful</li>
                <li>Properties must meet basic safety and hygiene standards</li>
                <li>Listings are subject to admin approval before going live</li>
                <li>We reserve the right to reject any listing that doesn't meet our standards</li>
                <li>You must respond to booking inquiries within 24 hours</li>
              </ul>
              
              <p className="mt-4"><strong>For Tenants:</strong></p>
              <ul className="list-disc pl-6 space-y-2">
                <li>All bookings are subject to property owner approval</li>
                <li>Accurate information must be provided during booking</li>
                <li>Respect property rules and local regulations</li>
                <li>Report any issues immediately through our platform</li>
              </ul>
            </div>
          </section>

          {/* Payments */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
              <CreditCard className="w-5 h-5 text-blue-600 mr-2" />
              4. Payments & Refunds
            </h3>
            <div className="space-y-3 text-gray-700">
              <p>All payments are processed securely through our integrated payment gateway.</p>
              <p>Refund policies may vary by property and are clearly stated during booking.</p>
              <p>Service fees are non-refundable except in cases of platform error.</p>
              <p>Disputes should be reported within 48 hours of the incident.</p>
            </div>
          </section>

          {/* Privacy */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">5. Privacy Policy</h3>
            <p className="text-gray-700 leading-relaxed">
              Your privacy is important to us. We collect and use your information only as described 
              in our Privacy Policy. By using our service, you agree to the collection and use of 
              information in accordance with our Privacy Policy.
            </p>
          </section>

          {/* Prohibited Uses */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">6. Prohibited Uses</h3>
            <div className="text-gray-700">
              <p className="mb-3">You may not use our service:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>To submit false or misleading information</li>
                <li>To upload or transmit viruses or any other type of malicious code</li>
              </ul>
            </div>
          </section>

          {/* Liability */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">7. Limitation of Liability</h3>
            <p className="text-gray-700 leading-relaxed">
              Ghar acts as a platform connecting property owners and tenants. We are not responsible 
              for the condition of properties, the behavior of users, or any disputes that may arise. 
              Our liability is limited to the service fees paid.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">8. Termination</h3>
            <p className="text-gray-700 leading-relaxed">
              We may terminate or suspend your account and bar access to the service immediately, 
              without prior notice or liability, under our sole discretion, for any reason whatsoever 
              and without limitation, including but not limited to a breach of the Terms.
            </p>
          </section>

          {/* Changes */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">9. Changes to Terms</h3>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
              If a revision is material, we will provide at least 30 days notice prior to any new terms 
              taking effect.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">10. Contact Information</h3>
            <div className="text-gray-700 space-y-2">
              <p>If you have any questions about these Terms and Conditions, please contact us:</p>
              <p>Email: legal@ghar.com</p>
              <p>Phone: +91 12345 67890</p>
              <p>Address: Ghar Technologies Pvt Ltd, India</p>
            </div>
          </section>

          {/* Agreement */}
          <motion.div 
            className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-gray-800 font-medium">
              By using our service, you acknowledge that you have read and understand these 
              Terms and Conditions and agree to be bound by them.
            </p>
          </motion.div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            I Accept Terms & Conditions
          </button>
          <button
            onClick={() => navigate('/contact')}
            className="px-8 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors font-medium"
          >
            Contact Us
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
