import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { User } from '../../types/user';

interface AccountSidebarProps {
  activeSection?: string;
  onNavigate?: (section: string) => void;
  user: User;
  isMobile?: boolean;
  onClose?: () => void;
  onLogout?: () => void;
}

export const AccountSidebar: React.FC<AccountSidebarProps> = ({
  activeSection,
  onNavigate,
  user,
  isMobile = false,
  onClose,
  onLogout,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveSection = () => {
    if (activeSection) return activeSection;

    const path = location.pathname;
    if (path.includes('/orders')) return 'orders';
    if (path.includes('/addresses')) return 'addresses';
    if (path.includes('/wishlist')) return 'wishlist';
    if (path.includes('/settings')) return 'settings';
    if (path.includes('/comparison')) return 'comparison';
    return 'dashboard';
  };

  const currentSection = getActiveSection();

  const handleNavigation = (section: string, path: string) => {
    if (onNavigate) {
      onNavigate(section);
    } else {
      navigate(path);
    }
    if (isMobile && onClose) {
      onClose();
    }
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'dashboard',
      path: '/account',
    },
    {
      id: 'orders',
      label: 'My Orders',
      icon: 'shopping_bag',
      path: '/account/orders',
    },
    {
      id: 'addresses',
      label: 'Addresses',
      icon: 'location_on',
      path: '/account/addresses',
    },
    {
      id: 'wishlist',
      label: 'Wishlist',
      icon: 'favorite',
      path: '/account/wishlist',
    },
    {
      id: 'comparison',
      label: 'Compare',
      icon: 'compare',
      path: '/account/comparison',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'settings',
      path: '/account/settings',
    },
  ];

  const getMembershipBadgeColor = (tier: string) => {
    switch (tier) {
      case 'platinum':
        return 'bg-gray-800 text-white';
      case 'gold':
        return 'bg-yellow-500 text-white';
      case 'silver':
        return 'bg-gray-400 text-white';
      case 'bronze':
        return 'bg-orange-600 text-white';
      default:
        return 'bg-gray-300 text-gray-700';
    }
  };

  return (
    <div className={`bg-white border-r border-gray-200 ${isMobile ? 'w-full' : 'w-64'} h-full`}>
      {/* User Profile Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="relative">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                <span className="text-pink-600 font-semibold text-lg">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div
              className={`absolute -bottom-1 -right-1 px-2 py-1 rounded-full text-xs font-medium ${getMembershipBadgeColor(user.membershipTier)}`}
            >
              {user.membershipTier.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 truncate">{user.name}</h3>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
            <div className="flex items-center mt-1">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getMembershipBadgeColor(user.membershipTier)}`}
              >
                {user.membershipTier.charAt(0).toUpperCase() + user.membershipTier.slice(1)}
              </span>
              <span className="ml-2 text-xs text-gray-500">{user.points.toLocaleString()} pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = currentSection === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => handleNavigation(item.id, item.path)}
                  className={`
                    w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                    ${
                      isActive
                        ? 'bg-pink-50 text-pink-700 border-l-4 border-pink-500'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <span className="material-symbols-rounded mr-3 text-lg">{item.icon}</span>
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <button
          onClick={() => {
            if (onLogout) {
              onLogout();
            } else {
              // Fallback to using useAuth if no onLogout prop provided
              console.log('Logout clicked - no handler provided');
            }
          }}
          className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200"
        >
          <span className="material-symbols-rounded mr-3 text-lg">logout</span>
          Logout
        </button>
      </div>
    </div>
  );
};
