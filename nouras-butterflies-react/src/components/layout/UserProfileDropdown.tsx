import React, { useState, useRef, useEffect } from 'react';
import type { User } from '../../types/user';
import { useAdmin } from '../../contexts/AdminContext';

interface UserProfileDropdownProps {
  user: User;
  onLogout: () => void;
  onNavigate: (path: string) => void;
}

export const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({
  user,
  onLogout,
  onNavigate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isAdmin } = useAdmin();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNavigate = (path: string) => {
    onNavigate(path);
    setIsOpen(false);
  };

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

  const menuItems = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      path: '/account',
      description: 'View your account overview',
    },
    {
      label: 'My Orders',
      icon: 'shopping_bag',
      path: '/account/orders',
      description: 'Track your orders',
    },
    {
      label: 'Wishlist',
      icon: 'favorite',
      path: '/account/wishlist',
      description: 'View saved items',
    },
    {
      label: 'Settings',
      icon: 'settings',
      path: '/account/settings',
      description: 'Manage your profile',
    },
  ];

  // Add admin menu items if user is admin
  const adminMenuItems = isAdmin
    ? [
        {
          label: 'Admin Dashboard',
          icon: 'admin_panel_settings',
          path: '/admin/dashboard',
          description: 'Access admin panel',
        },
      ]
    : [];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
      >
        {/* User Avatar */}
        {user.avatar ? (
          <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
            <span className="text-pink-600 font-semibold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {/* User Info */}
        <div className="text-left">
          <p className="text-sm font-medium text-gray-900">{user.name}</p>
          <div className="flex items-center space-x-2">
            <span
              className={`
                inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                ${getMembershipBadgeColor(user.membershipTier)}
              `}
            >
              {user.membershipTier.charAt(0).toUpperCase()}
            </span>
            <span className="text-xs text-gray-500">{user.points.toLocaleString()} pts</span>
          </div>
        </div>

        {/* Dropdown Arrow */}
        <span
          className={`
            material-symbols-rounded text-gray-400 transition-transform duration-200
            ${isOpen ? 'rotate-180' : ''}
          `}
        >
          expand_more
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {/* User Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                  <span className="text-pink-600 font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {[...menuItems, ...adminMenuItems].map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors duration-200"
              >
                <span className="material-symbols-rounded text-gray-400">{item.icon}</span>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Admin Divider */}
          {isAdmin && (
            <>
              <div className="border-t border-gray-100 my-2" />
              <div className="px-4 py-2">
                <div className="flex items-center space-x-2">
                  <span className="material-symbols-rounded text-admin-primary text-sm">
                    admin_panel_settings
                  </span>
                  <span className="text-xs font-medium text-admin-primary">Admin Section</span>
                </div>
              </div>
            </>
          )}

          {/* Divider */}
          <div className="border-t border-gray-100 my-2" />

          {/* Logout Button */}
          <button
            onClick={() => {
              onLogout();
              setIsOpen(false);
            }}
            className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-red-50 transition-colors duration-200"
          >
            <span className="material-symbols-rounded text-red-500">logout</span>
            <div className="text-left">
              <p className="text-sm font-medium text-red-600">Logout</p>
              <p className="text-xs text-gray-500">Sign out of your account</p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};
