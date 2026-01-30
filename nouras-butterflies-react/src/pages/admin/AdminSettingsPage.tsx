import React, { useState } from 'react';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminTopNav } from '../../components/admin/AdminTopNav';
import { cn } from '../../utils/cn';

const AdminSettingsPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('store');

  const tabs = [
    { id: 'store', label: 'Store Settings', icon: 'store' },
    { id: 'payment', label: 'Payment', icon: 'payment' },
    { id: 'shipping', label: 'Shipping', icon: 'local_shipping' },
    { id: 'email', label: 'Email Templates', icon: 'email' },
    { id: 'tax', label: 'Tax Settings', icon: 'receipt' },
    { id: 'users', label: 'User Management', icon: 'people' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Navigation */}
        <AdminTopNav />

        {/* Page Content */}
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-gray-600">Configure your store settings and preferences</p>
          </div>

          {/* Tabs */}
          <div className="bg-white dark:bg-surface-dark rounded-xl shadow-soft-card mb-6">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
                      activeTab === tab.id
                        ? 'border-admin-primary text-admin-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    )}
                  >
                    <span className="material-symbols-outlined text-lg mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'store' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Store Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Store Name
                        </label>
                        <input
                          type="text"
                          defaultValue="Noura's Butterflies"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Store Email
                        </label>
                        <input
                          type="email"
                          defaultValue="contact@nourasbutterflies.com"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          defaultValue="+1-555-0123"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address
                        </label>
                        <textarea
                          rows={3}
                          defaultValue="123 Butterfly Lane, Beauty City, BC 12345"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary/20"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Social Media
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Facebook
                        </label>
                        <input
                          type="url"
                          placeholder="https://facebook.com/yourstore"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Instagram
                        </label>
                        <input
                          type="url"
                          placeholder="https://instagram.com/yourstore"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Twitter
                        </label>
                        <input
                          type="url"
                          placeholder="https://twitter.com/yourstore"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary/20"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button className="px-4 py-2 bg-admin-primary text-white rounded-lg hover:bg-admin-primary/90 transition-colors duration-200">
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'payment' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Payment Gateway Configuration
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">Stripe</h4>
                          <p className="text-sm text-gray-500">Accept credit card payments</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-admin-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-admin-primary" />
                        </label>
                      </div>
                      <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">PayPal</h4>
                          <p className="text-sm text-gray-500">Accept PayPal payments</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-admin-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-admin-primary" />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Stripe Configuration
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Publishable Key
                        </label>
                        <input
                          type="text"
                          placeholder="pk_test_..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Secret Key
                        </label>
                        <input
                          type="password"
                          placeholder="sk_test_..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Webhook Secret
                        </label>
                        <input
                          type="password"
                          placeholder="whsec_..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary/20"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button className="px-4 py-2 bg-admin-primary text-white rounded-lg hover:bg-admin-primary/90 transition-colors duration-200">
                      Save Payment Settings
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Shipping Settings
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Free Shipping Threshold
                        </label>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500">$</span>
                          <input
                            type="number"
                            defaultValue="50"
                            className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary/20"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Flat Rate Shipping
                        </label>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500">$</span>
                          <input
                            type="number"
                            defaultValue="9.99"
                            step="0.01"
                            className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary/20"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Shipping Zones
                    </h3>
                    <div className="space-y-4">
                      <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-white">Domestic</h4>
                          <button className="text-admin-primary hover:text-admin-primary/80 text-sm">
                            Edit
                          </button>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p>Standard: $9.99 (5-7 days)</p>
                          <p>Express: $19.99 (2-3 days)</p>
                        </div>
                      </div>
                      <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            International
                          </h4>
                          <button className="text-admin-primary hover:text-admin-primary/80 text-sm">
                            Edit
                          </button>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p>Standard: $29.99 (10-14 days)</p>
                          <p>Express: $49.99 (3-5 days)</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button className="px-4 py-2 bg-admin-primary text-white rounded-lg hover:bg-admin-primary/90 transition-colors duration-200">
                      Save Shipping Settings
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'email' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Email Templates
                    </h3>
                    <div className="space-y-4">
                      <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            Order Confirmation
                          </h4>
                          <button className="text-admin-primary hover:text-admin-primary/80 text-sm">
                            Edit
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          Sent when customer places an order
                        </p>
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded text-sm">
                          <p>Dear {`{customer_name}`},</p>
                          <p>Thank you for your order #{`{order_number}`}...</p>
                        </div>
                      </div>
                      <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            Shipping Notification
                          </h4>
                          <button className="text-admin-primary hover:text-admin-primary/80 text-sm">
                            Edit
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Sent when order is shipped</p>
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded text-sm">
                          <p>Hi {`{customer_name}`},</p>
                          <p>Your order #{`{order_number}`} has been shipped...</p>
                        </div>
                      </div>
                      <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            Welcome Email
                          </h4>
                          <button className="text-admin-primary hover:text-admin-primary/80 text-sm">
                            Edit
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          Sent when customer creates account
                        </p>
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded text-sm">
                          <p>Welcome to Noura's Butterflies, {`{customer_name}`}!</p>
                          <p>Thank you for joining our community...</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button className="px-4 py-2 bg-admin-primary text-white rounded-lg hover:bg-admin-primary/90 transition-colors duration-200">
                      Save Email Templates
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'tax' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Tax Settings
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tax Rate
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            defaultValue="8.5"
                            step="0.1"
                            min="0"
                            max="100"
                            className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary/20"
                          />
                          <span className="text-gray-600">%</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tax Calculation
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary/20">
                          <option>Included in price</option>
                          <option>Added at checkout</option>
                          <option>No tax</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tax Regions
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              defaultChecked
                              className="rounded border-gray-300 text-admin-primary focus:ring-admin-primary"
                            />
                            <span className="text-sm text-gray-700">United States</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 text-admin-primary focus:ring-admin-primary"
                            />
                            <span className="text-sm text-gray-700">Canada</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 text-admin-primary focus:ring-admin-primary"
                            />
                            <span className="text-sm text-gray-700">European Union</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button className="px-4 py-2 bg-admin-primary text-white rounded-lg hover:bg-admin-primary/90 transition-colors duration-200">
                      Save Tax Settings
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'users' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      User Management
                    </h3>
                    <div className="space-y-4">
                      <div className="border border-gray-200 dark:border-gray-600 rounded-lg">
                        <div className="p-4">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                            Add Admin User
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                              </label>
                              <input
                                type="email"
                                placeholder="admin@example.com"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary/20"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Role
                              </label>
                              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary/20">
                                <option value="admin">Administrator</option>
                                <option value="manager">Manager</option>
                                <option value="staff">Staff</option>
                              </select>
                            </div>
                            <button className="px-4 py-2 bg-admin-primary text-white rounded-lg hover:bg-admin-primary/90 transition-colors duration-200">
                              Add User
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="border border-gray-200 dark:border-gray-600 rounded-lg">
                        <div className="p-4">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                            Current Admin Users
                          </h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-admin-primary rounded-full flex items-center justify-center">
                                  <span className="material-symbols-outlined text-white text-sm">
                                    person
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-white">
                                    Admin User
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    admin@nourasbutterflies.com
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="px-2 py-1 text-xs bg-admin-gold text-white rounded-full">
                                  Admin
                                </span>
                                <button className="text-red-600 hover:text-red-700 text-sm">
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button className="px-4 py-2 bg-admin-primary text-white rounded-lg hover:bg-admin-primary/90 transition-colors duration-200">
                      Save User Settings
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
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

export default AdminSettingsPage;
