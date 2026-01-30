import React, { useState, type ReactNode } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopNav } from './AdminTopNav';
import { cn } from '../../utils/cn';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AdminLayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  pageTitle?: string;
  className?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  breadcrumbs = [],
  pageTitle,
  className,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Navigation */}
        <AdminTopNav />

        {/* Page Content */}
        <div className={cn('p-6', className)}>
          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
              {breadcrumbs.map((item, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <span>/</span>}
                  {item.href ? (
                    <button
                      onClick={() => item.href && (window.location.href = item.href)}
                      className="hover:text-gray-900 transition-colors duration-200"
                    >
                      {item.label}
                    </button>
                  ) : (
                    <span className="text-gray-900 font-medium">{item.label}</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          {/* Page Title */}
          {pageTitle && (
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{pageTitle}</h1>
            </div>
          )}

          {/* Page Content */}
          {children}
        </div>
      </div>

      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed bottom-4 right-4 w-14 h-14 bg-admin-primary text-white rounded-full shadow-lg flex items-center justify-center z-50"
      >
        <span className="material-symbols-outlined text-xl">menu</span>
      </button>
    </div>
  );
};
