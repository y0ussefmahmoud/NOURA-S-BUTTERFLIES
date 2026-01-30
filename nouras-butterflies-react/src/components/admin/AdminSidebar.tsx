import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../utils/cn';

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

const menuItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: 'dashboard' },
  { name: 'Orders', href: '/admin/orders', icon: 'shopping_bag' },
  { name: 'Products', href: '/admin/products', icon: 'inventory_2' },
  { name: 'Customers', href: '/admin/customers', icon: 'people' },
  { name: 'Marketing', href: '/admin/marketing', icon: 'campaign' },
  { name: 'Settings', href: '/admin/settings', icon: 'settings' },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isOpen = true,
  onClose,
  className,
}) => {
  const location = useLocation();

  const getActiveItem = () => {
    const path = location.pathname;
    return menuItems.find((item) => path.startsWith(item.href))?.name || 'Dashboard';
  };

  const activeItem = getActiveItem();

  const handleItemClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed left-0 top-0 h-full bg-admin-sidebar border-r border-admin-primary/20 transform transition-transform duration-300 ease-in-out z-50',
          'w-64', // Fixed width
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          className
        )}
      >
        {/* Brand Header */}
        <div className="flex items-center gap-3 p-6 border-b border-admin-primary/20">
          <div className="w-10 h-10 bg-admin-primary rounded-lg flex items-center justify-center">
            <span className="material-symbols-filled text-white text-xl">flutter</span>
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">Noura's Butterflies</h1>
            <p className="text-xs text-gray-600">Admin Panel</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = activeItem === item.name;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    onClick={handleItemClick}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                      'hover:bg-admin-primary/10',
                      isActive && 'bg-admin-primary text-white shadow-md',
                      isActive ? 'shadow-lg' : 'text-gray-700'
                    )}
                  >
                    <span
                      className={cn(
                        'material-symbols text-xl',
                        isActive ? 'material-symbols-filled' : 'material-symbols-outlined'
                      )}
                    >
                      {item.icon}
                    </span>
                    <span className={cn('font-medium', isActive ? 'text-white' : 'text-gray-700')}>
                      {item.name}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Help Center Link */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-admin-primary/20">
          <Link
            to="/admin/help"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-admin-primary/10 transition-all duration-200"
          >
            <span className="material-symbols-outlined text-xl">help_center</span>
            <span className="font-medium">Help Center</span>
          </Link>
        </div>
      </div>
    </>
  );
};
