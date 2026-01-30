import React, { useState } from 'react';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminTopNav } from '../../components/admin/AdminTopNav';
import { StatsCard } from '../../components/admin/StatsCard';
import { DataTable } from '../../components/admin/DataTable';
import { BarChart } from '../../components/admin/charts/BarChart';
import {
  mockSalesMetrics,
  mockTopProducts,
  mockRevenueChartData,
  mockOrders,
  mockInventoryAlerts,
} from '../../data/mockAdmin';
import { cn } from '../../utils/cn';
import type { DataTableColumn, Order } from '../../types/admin';

const AdminDashboardPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('6months');

  // Order table columns
  const orderColumns: DataTableColumn<Order>[] = [
    {
      key: 'orderNumber',
      label: 'Order ID',
      sortable: true,
      render: (value: string) => <span className="font-medium text-admin-primary">#{value}</span>,
    },
    {
      key: 'customer',
      label: 'Customer',
      render: (customer: Order['customer']) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-sm text-gray-600">person</span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{customer.name}</p>
            <p className="text-xs text-gray-500">{customer.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Date',
      sortable: true,
      render: (date: Date) => (
        <span className="text-sm text-gray-600">{date.toLocaleDateString()}</span>
      ),
    },
    {
      key: 'total',
      label: 'Amount',
      sortable: true,
      render: (total: number) => (
        <span className="font-medium text-gray-900">${total.toFixed(2)}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (status: Order['status']) => {
        const statusColors = {
          pending: 'bg-yellow-100 text-yellow-800',
          processing: 'bg-blue-100 text-blue-800',
          shipped: 'bg-admin-sage/20 text-admin-sage',
          delivered: 'bg-green-100 text-green-800',
          cancelled: 'bg-admin-coral/20 text-admin-coral',
        };

        return (
          <span className={cn('px-2 py-1 text-xs font-medium rounded-full', statusColors[status])}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      },
    },
  ];

  const orderActions = [
    {
      label: 'View',
      icon: 'visibility',
      onClick: (order: Order) => console.log('View order:', order.id),
    },
    {
      label: 'Edit',
      icon: 'edit',
      onClick: (order: Order) => console.log('Edit order:', order.id),
    },
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Admin! 👋</h1>
            <p className="text-gray-600">Here's what's happening with your store today.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Sales"
              value={mockSalesMetrics.revenue.current}
              change={mockSalesMetrics.revenue.growth}
              changeType="increase"
              icon="trending_up"
              subtitle="Revenue this month"
              format="currency"
            />
            <StatsCard
              title="New Orders"
              value={mockSalesMetrics.orders.current}
              change={mockSalesMetrics.orders.growth}
              changeType="increase"
              icon="shopping_bag"
              subtitle="Orders this month"
              format="number"
            />
            <StatsCard
              title="Customers"
              value={mockSalesMetrics.customers.current}
              change={mockSalesMetrics.customers.growth}
              changeType="increase"
              icon="people"
              subtitle="Active customers"
              format="number"
            />
            <StatsCard
              title="Low Stock Alerts"
              value={mockInventoryAlerts.length}
              change={-15}
              changeType="decrease"
              icon="warning"
              subtitle="Items need restocking"
              format="number"
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Sales Revenue Chart */}
            <div className="lg:col-span-2 bg-white dark:bg-surface-dark rounded-xl p-6 shadow-soft-card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Sales Revenue
                </h2>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-1 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary/20"
                >
                  <option value="1month">Last Month</option>
                  <option value="3months">Last 3 Months</option>
                  <option value="6months">Last 6 Months</option>
                  <option value="1year">Last Year</option>
                </select>
              </div>
              <BarChart data={mockRevenueChartData} height={250} />
            </div>

            {/* Top Sellers */}
            <div className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-soft-card">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Top Sellers
              </h2>
              <div className="space-y-4">
                {mockTopProducts.map((product) => (
                  <div key={product.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="material-symbols-outlined text-sm text-gray-600">
                        inventory_2
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.unitsSold} units sold</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 text-sm">
                        ${product.revenue.toLocaleString()}
                      </p>
                      <p
                        className={cn(
                          'text-xs',
                          product.growth > 0 ? 'text-green-600' : 'text-red-600'
                        )}
                      >
                        {product.growth > 0 ? '+' : ''}
                        {product.growth}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-soft-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
              <button className="text-sm text-admin-primary hover:text-admin-primary/80 font-medium">
                View all orders
              </button>
            </div>
            <DataTable
              columns={orderColumns}
              data={mockOrders.slice(0, 5)}
              actions={orderActions}
              onRowClick={(order) => console.log('Row clicked:', order)}
            />
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

export default AdminDashboardPage;
