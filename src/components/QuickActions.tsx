import React, { useState, useEffect } from 'react';
import { Search, Plus, Heart, MapPin, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const QuickActions: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  const actions = [
    {
      icon: Search,
      label: 'Search PGs',
      onClick: () => navigate('/search'),
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      icon: Phone,
      label: 'Support',
      onClick: () => window.open('tel:9907002817'),
      color: 'bg-purple-600 hover:bg-purple-700'
    }
  ];

  if (user?.role === 'owner') {
    actions.unshift({
      icon: Plus,
      label: 'Add PG',
      onClick: () => navigate('/owner/add-pg'),
      color: 'bg-orange-600 hover:bg-orange-700'
    });
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex flex-col space-y-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={`action-${index}`}
              onClick={action.onClick}
              className={`${action.color} text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110`}
              title={action.label}
            >
              <Icon className="w-5 h-5" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;