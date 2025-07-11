import React from 'react';
import { Users, Target, Heart, Award } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Ghar</h1>
          <p className="text-xl text-blue-100">
            Making quality accommodation accessible for students and professionals across India
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="text-center">
              <Target className="w-16 h-16 text-blue-600 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 text-lg">
                To provide safe, affordable, and comfortable living spaces for students and young professionals, 
                making their transition to new cities seamless and stress-free.
              </p>
            </div>
            <div className="text-center">
              <Heart className="w-16 h-16 text-blue-600 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-600 text-lg">
                To become India's most trusted platform for PG and hostel accommodations, 
                connecting millions of students with their perfect home away from home.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Community First</h3>
              <p className="text-gray-600">Building strong communities where residents feel at home and connected.</p>
            </div>
            <div className="text-center">
              <Award className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Quality Assured</h3>
              <p className="text-gray-600">Every property is verified and meets our high standards for safety and comfort.</p>
            </div>
            <div className="text-center">
              <Heart className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Care & Support</h3>
              <p className="text-gray-600">24/7 support to ensure our residents have the best living experience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Story</h2>
          <div className="text-lg text-gray-600 space-y-6">
            <p>
              Founded in 2025, Ghar was born from the personal experiences of students struggling to find 
              quality accommodation in new cities. Our founders understood the challenges of finding a safe, 
              affordable, and comfortable place to live while pursuing education or career goals.
            </p>
            <p>
              Today, we've helped over 50,000 students and professionals find their perfect home across 15+ cities in India. 
              Our platform connects verified PG owners with students, ensuring transparency, safety, and convenience for all.
            </p>
            <p>
              We continue to grow with the mission of making quality accommodation accessible to everyone, 
              one home at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-200">Verified PGs</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-blue-200">Happy Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">15+</div>
              <div className="text-blue-200">Cities</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-200">Support</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;