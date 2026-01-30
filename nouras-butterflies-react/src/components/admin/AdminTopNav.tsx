import React, { useState, useRef } from 'react';
import { cn } from '../../utils/cn';
import { useTheme } from '../../contexts/ThemeContext';

interface AdminTopNavProps {
  className?: string;
}

export const AdminTopNav: React.FC<AdminTopNavProps> = ({ className }) => {
  const { toggleTheme, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    {
      id: 1,
      title: 'New order received',
      message: 'Order #ORD-2024-004 from John Doe',
      time: '2 min ago',
      read: false,
    },
    {
      id: 2,
      title: 'Low stock alert',
      message: 'Lavender Dreams is running low on stock',
      time: '1 hour ago',
      read: false,
    },
    {
      id: 3,
      title: 'Customer review',
      message: 'Sarah left a 5-star review',
      time: '3 hours ago',
      read: true,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div
      className={cn(
        'sticky top-0 z-40 bg-surface-light/80 backdrop-blur-lg border-b border-primary/10',
        className
      )}
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              search
            </span>
            <input
              type="text"
              placeholder="Search products, orders, customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-admin-primary/20 focus:border-admin-primary transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <span className="material-symbols-outlined text-xl">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  <p className="text-sm text-gray-600">{unreadCount} unread</p>
                </div>
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        'p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200',
                        !notification.read && 'bg-blue-50'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            'w-2 h-2 rounded-full mt-2',
                            !notification.read ? 'bg-blue-500' : 'bg-transparent'
                          )}
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{notification.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-200">
                  <button className="text-sm text-admin-primary hover:text-admin-primary/80 font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <span className="material-symbols-outlined text-xl">
              {isDark ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-600">Administrator</p>
              </div>
              <div className="w-8 h-8 bg-admin-primary rounded-full flex items-center justify-center ring-2 ring-white">
                <span className="material-symbols-filled text-white text-sm">person</span>
              </div>
            </button>

            {/* Profile Dropdown */}
            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <p className="font-medium text-gray-900">Admin User</p>
                  <p className="text-sm text-gray-600">admin@nourasbutterflies.com</p>
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-admin-gold text-white rounded-full mt-1">
                    Administrator
                  </span>
                </div>
                <div className="py-2">
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                    <span className="material-symbols-outlined text-lg mr-3">person</span>
                    Profile
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                    <span className="material-symbols-outlined text-lg mr-3">settings</span>
                    Settings
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                    <span className="material-symbols-outlined text-lg mr-3">logout</span>
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
