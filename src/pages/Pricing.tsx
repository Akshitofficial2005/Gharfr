import React, { useState } from 'react';
import { Check, Star, Zap, Crown, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Pricing: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'Basic',
      icon: Star,
      description: 'Perfect for getting started',
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        'List up to 2 PGs',
        'Basic listing visibility',
        'Email support',
        'Basic analytics',
        'Mobile app access'
      ],
      limitations: [
        'Limited to 2 properties',
        'Standard listing position',
        'Basic support only'
      ],
      buttonText: 'Get Started Free',
      buttonStyle: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
      popular: false
    },
    {
      name: 'Premium',
      icon: Zap,
      description: 'Most popular for growing owners',
      monthlyPrice: 999,
      yearlyPrice: 9990, // 2 months free
      features: [
        'List up to 10 PGs',
        'Priority listing visibility',
        'Phone & email support',
        'Advanced analytics & insights',
        'Lead management tools',
        'Custom PG page design',
        'Social media promotion',
        'Booking management system'
      ],
      limitations: [],
      buttonText: 'Start Premium',
      buttonStyle: 'bg-blue-600 text-white hover:bg-blue-700',
      popular: true
    },
    {
      name: 'Featured',
      icon: Crown,
      description: 'Maximum visibility and features',
      monthlyPrice: 1999,
      yearlyPrice: 19990, // 2 months free
      features: [
        'Unlimited PG listings',
        'Top featured placement',
        'Priority phone support',
        'Detailed analytics dashboard',
        'Advanced lead management',
        'Premium PG page design',
        'Social media & Google Ads',
        'Complete booking automation',
        'Revenue optimization tools',
        'Dedicated account manager',
        'Custom branding options'
      ],
      limitations: [],
      buttonText: 'Go Featured',
      buttonStyle: 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700',
      popular: false
    }
  ];

  const handlePlanSelect = (planName: string, price: number) => {
    if (price === 0) {
      toast.success('Welcome to Ghar! You can start listing your PGs for free.');
    } else {
      toast.success(`${planName} plan selected! Redirecting to payment...`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Pricing Plans</h1>
          <p className="text-xl text-blue-100 mb-8">
            Choose the perfect plan to grow your PG business
          </p>
          
          {/* Billing Toggle */}
          <div className="inline-flex bg-white bg-opacity-20 rounded-lg p-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-white text-blue-600'
                  : 'text-white hover:text-blue-200'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'yearly'
                  ? 'bg-white text-blue-600'
                  : 'text-white hover:text-blue-200'
              }`}
            >
              Yearly
              <span className="ml-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
              const monthlyPrice = billingCycle === 'yearly' ? Math.round(price / 12) : price;
              
              return (
                <div
                  key={index}
                  className={`relative bg-white rounded-2xl shadow-lg border-2 p-8 ${
                    plan.popular ? 'border-blue-500 scale-105' : 'border-gray-200'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-8">
                    <div className={`inline-flex p-3 rounded-full mb-4 ${
                      plan.popular ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <Icon className={`w-8 h-8 ${
                        plan.popular ? 'text-blue-600' : 'text-gray-600'
                      }`} />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-6">{plan.description}</p>
                    
                    <div className="mb-6">
                      <div className="flex items-center justify-center">
                        <span className="text-4xl font-bold text-gray-900">
                          ₹{monthlyPrice.toLocaleString()}
                        </span>
                        <span className="text-gray-600 ml-2">/month</span>
                      </div>
                      {billingCycle === 'yearly' && price > 0 && (
                        <p className="text-sm text-green-600 mt-2">
                          Billed yearly: ₹{price.toLocaleString()} (Save ₹{(plan.monthlyPrice * 12 - price).toLocaleString()})
                        </p>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handlePlanSelect(plan.name, price)}
                      className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${plan.buttonStyle}`}
                    >
                      {plan.buttonText}
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">What's included:</h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I change my plan anytime?
              </h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a setup fee?
              </h3>
              <p className="text-gray-600">
                No, there are no setup fees. You only pay the monthly or yearly subscription fee for your chosen plan.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards, debit cards, UPI, net banking, and digital wallets.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600">
                We offer a 7-day money-back guarantee for all paid plans. If you're not satisfied, we'll refund your payment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to grow your PG business?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of successful PG owners on Ghar platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handlePlanSelect('Premium', 999)}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Free Trial
            </button>
            <a
              href="/contact"
              className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center"
            >
              Contact Sales
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;