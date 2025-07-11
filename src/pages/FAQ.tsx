import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, HelpCircle } from 'lucide-react';

const FAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const faqs = [
    {
      category: "General",
      questions: [
        {
          question: "What is Ghar?",
          answer: "Ghar is a platform that connects students and professionals with verified PG accommodations and hostels across India. We help you find safe, affordable, and comfortable living spaces."
        },
        {
          question: "How does Ghar work?",
          answer: "Simply search for PGs in your preferred location, browse through verified listings, compare prices and amenities, and book directly through our platform. We handle the entire process from search to move-in."
        },
        {
          question: "Is Ghar free to use?",
          answer: "Yes, searching and booking PGs through Ghar is completely free for students and professionals. We don't charge any brokerage or hidden fees."
        }
      ]
    },
    {
      category: "Booking",
      questions: [
        {
          question: "How do I book a PG?",
          answer: "Browse PGs, select your preferred room type, choose your move-in date and duration, fill in your details, and pay the booking amount (first month rent + caution money). You'll receive confirmation within 24 hours."
        },
        {
          question: "What do I need to pay while booking?",
          answer: "You need to pay the first month's rent and caution money (security deposit) while booking. Monthly rent will be paid directly to the PG owner from the second month onwards."
        },
        {
          question: "Can I cancel my booking?",
          answer: "Yes, you can cancel your booking up to 48 hours before your move-in date. Cancellation charges may apply as per our policy. The caution money is refundable upon checkout."
        },
        {
          question: "How do I pay monthly rent?",
          answer: "After your first month, you can pay monthly rent through your profile dashboard. We'll send you reminders before the due date, and you can pay online through various payment methods."
        }
      ]
    },
    {
      category: "PG Owners",
      questions: [
        {
          question: "How can I list my PG on Ghar?",
          answer: "Click on 'List Your PG' in the menu, fill out the property details form, upload photos, and submit for verification. Our team will review and approve your listing within 2-3 business days."
        },
        {
          question: "What are the charges for listing?",
          answer: "We offer different pricing plans - Basic (free), Premium (₹999/month), and Featured (₹1999/month). Each plan offers different visibility and features for your listing."
        },
        {
          question: "How do I manage bookings?",
          answer: "Use the Owner Dashboard to view inquiries, manage bookings, track payments, and communicate with tenants. You'll receive notifications for all booking activities."
        }
      ]
    },
    {
      category: "Safety & Security",
      questions: [
        {
          question: "Are all PGs verified?",
          answer: "Yes, every PG listed on Ghar goes through our verification process. We check legal documents, visit the property, and ensure it meets our safety and quality standards."
        },
        {
          question: "What if I face issues with my PG?",
          answer: "Contact our support team immediately. We have a dedicated resolution team that works with both tenants and PG owners to resolve any issues quickly and fairly."
        },
        {
          question: "Is my payment information secure?",
          answer: "Absolutely. We use industry-standard encryption and secure payment gateways. Your financial information is never stored on our servers and all transactions are protected."
        }
      ]
    }
  ];

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  };

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <HelpCircle className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h1>
          <p className="text-xl text-blue-100">
            Find answers to common questions about Ghar and our services
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Search Bar */}
        <div className="mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            />
          </div>
        </div>

        {/* FAQ Categories */}
        {filteredFaqs.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              {category.category}
            </h2>
            
            <div className="space-y-4">
              {category.questions.map((faq, questionIndex) => {
                const globalIndex = categoryIndex * 100 + questionIndex;
                const isOpen = openItems.includes(globalIndex);
                
                return (
                  <div key={questionIndex} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleItem(globalIndex)}
                      className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-lg font-medium text-gray-900 pr-4">
                        {faq.question}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                      )}
                    </button>
                    
                    {isOpen && (
                      <div className="px-6 pb-4">
                        <p className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {filteredFaqs.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600 mb-4">
              Try searching with different keywords or browse all questions above.
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Contact Section */}
        <div className="mt-16 bg-gray-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Still have questions?
          </h3>
          <p className="text-gray-600 mb-6">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Contact Support
            </a>
            <a
              href="tel:+919876543210"
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Call Us: +91 9876543210
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;