import React, { useState } from 'react';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminTopNav } from '../../components/admin/AdminTopNav';
import { DataTable } from '../../components/admin/DataTable';
import { mockCustomers } from '../../data/mockAdmin';
import { cn } from '../../utils/cn';
import type { DataTableColumn, Customer } from '../../types/admin';

const CustomerManagementPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Filter customers based on search and tier
  const filteredCustomers = mockCustomers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = selectedTier === 'all' || customer.membershipTier === selectedTier;

    return matchesSearch && matchesTier;
  });

  // Customer table columns
  const customerColumns: DataTableColumn<Customer>[] = [
    {
      key: 'avatar',
      label: 'Customer',
      render: (_, customer: Customer) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-admin-primary/10 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-admin-primary text-sm">person</span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{customer.name}</p>
            <p className="text-sm text-gray-500">{customer.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'membershipTier',
      label: 'Membership',
      sortable: true,
      render: (tier: Customer['membershipTier']) => {
        const tierColors = {
          bronze: 'bg-orange-100 text-orange-800',
          silver: 'bg-gray-100 text-gray-800',
          gold: 'bg-yellow-100 text-yellow-800',
          platinum: 'bg-purple-100 text-purple-800',
        };

        return (
          <span className={cn('px-2 py-1 text-xs font-medium rounded-full', tierColors[tier])}>
            {tier.charAt(0).toUpperCase() + tier.slice(1)}
          </span>
        );
      },
    },
    {
      key: 'totalOrders',
      label: 'Orders',
      sortable: true,
      render: (orders: number) => <span className="font-medium text-gray-900">{orders}</span>,
    },
    {
      key: 'totalSpent',
      label: 'Total Spent',
      sortable: true,
      render: (spent: number) => (
        <span className="font-medium text-gray-900">${spent.toFixed(2)}</span>
      ),
    },
    {
      key: 'lastOrderDate',
      label: 'Last Order',
      sortable: true,
      render: (date: Date) => (
        <span className="text-sm text-gray-600">{date ? date.toLocaleDateString() : 'Never'}</span>
      ),
    },
    {
      key: 'tags',
      label: 'Tags',
      render: (tags: string[]) => (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      ),
    },
  ];

  const customerActions = [
    {
      label: 'View',
      icon: 'visibility',
      onClick: (customer: Customer) => {
        setSelectedCustomer(customer);
      },
    },
    {
      label: 'Edit',
      icon: 'edit',
      onClick: (customer: Customer) => console.log('Edit customer:', customer.id),
    },
    {
      label: 'Message',
      icon: 'message',
      onClick: (customer: Customer) => console.log('Message customer:', customer.id),
    },
  ];

  const tiers = ['all', 'bronze', 'silver', 'gold', 'platinum'];

  const stats = {
    total: mockCustomers.length,
    new: mockCustomers.filter((c) => c.tags.includes('New')).length,
    active: mockCustomers.filter((c) => c.totalOrders > 0).length,
    vip: mockCustomers.filter((c) => c.tags.includes('VIP')).length,
  };

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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Management</h1>
              <p className="text-gray-600">
                Manage customer relationships, track orders, and analyze customer behavior
              </p>
            </div>
            <button className="px-4 py-2 bg-admin-primary text-white rounded-lg hover:bg-admin-primary/90 transition-colors duration-200 flex items-center gap-2">
              <span className="material-symbols-outlined">person_add</span>
              Add Customer
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-soft-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Customers
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-600">people</span>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-soft-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    New This Month
                  </p>
                  <p className="text-2xl font-bold text-green-600">{stats.new}</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-green-600">person_add</span>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-soft-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.active}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-600">shopping_bag</span>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-soft-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    VIP Customers
                  </p>
                  <p className="text-2xl font-bold text-purple-600">{stats.vip}</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-purple-600">stars</span>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-soft-card mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Search customers by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary/20"
                  />
                </div>
              </div>

              {/* Membership Tier Filter */}
              <div>
                <select
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary/20"
                >
                  {tiers.map((tier) => (
                    <option key={tier} value={tier}>
                      {tier === 'all' ? 'All Tiers' : tier.charAt(0).toUpperCase() + tier.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  Export
                </button>
                <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  Bulk Message
                </button>
              </div>
            </div>
          </div>

          {/* Customers Table */}
          <div className="bg-white dark:bg-surface-dark rounded-xl shadow-soft-card">
            <DataTable
              columns={customerColumns}
              data={filteredCustomers}
              actions={customerActions}
              onRowClick={(customer) => {
                setSelectedCustomer(customer);
              }}
              emptyMessage="No customers found matching your criteria"
            />
          </div>
        </div>
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setSelectedCustomer(null)}
          />

          {/* Modal */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white dark:bg-surface-dark rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white dark:bg-surface-dark border-b border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-admin-primary/10 rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-admin-primary">person</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {selectedCustomer.name}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">{selectedCustomer.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCustomer(null)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined text-gray-500">close</span>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Customer Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {selectedCustomer.totalOrders}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      ${selectedCustomer.totalSpent.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Points</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {selectedCustomer.points}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Member Since</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {new Date(selectedCustomer.createdAt).getFullYear()}
                    </p>
                  </div>
                </div>

                {/* Preferences */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Communication Preferences
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Newsletter</span>
                      <span
                        className={cn(
                          'px-2 py-1 text-xs rounded-full',
                          selectedCustomer.preferences.newsletter
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        )}
                      >
                        {selectedCustomer.preferences.newsletter ? 'Subscribed' : 'Unsubscribed'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">SMS Notifications</span>
                      <span
                        className={cn(
                          'px-2 py-1 text-xs rounded-full',
                          selectedCustomer.preferences.sms
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        )}
                      >
                        {selectedCustomer.preferences.sms ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Promotional Emails</span>
                      <span
                        className={cn(
                          'px-2 py-1 text-xs rounded-full',
                          selectedCustomer.preferences.promotions
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        )}
                      >
                        {selectedCustomer.preferences.promotions ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Customer Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCustomer.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Admin Notes</h3>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary/20"
                    rows={4}
                    placeholder="Add notes about this customer..."
                    defaultValue={selectedCustomer.notes || ''}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-white dark:bg-surface-dark border-t border-gray-200 dark:border-gray-700 p-6">
                <div className="flex justify-between">
                  <div className="flex gap-3">
                    <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2">
                      <span className="material-symbols-outlined">message</span>
                      Send Message
                    </button>
                    <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2">
                      <span className="material-symbols-outlined">history</span>
                      View Orders
                    </button>
                  </div>
                  <button
                    onClick={() => setSelectedCustomer(null)}
                    className="px-4 py-2 bg-admin-primary text-white rounded-lg hover:bg-admin-primary/90 transition-colors duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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

export default CustomerManagementPage;
