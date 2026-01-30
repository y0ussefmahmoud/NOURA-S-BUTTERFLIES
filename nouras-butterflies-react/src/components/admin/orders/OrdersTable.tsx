import React, { useState } from 'react';
import { DataTable } from '../DataTable';
import { OrderStatusBadge } from './OrderStatusBadge';
import { cn } from '../../../utils/cn';
import type { DataTableColumn, Order, OrderStatus } from '../../../types/admin';

interface OrdersTableProps {
  orders: Order[];
  onOrderClick?: (order: Order) => void;
  className?: string;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({ orders, onOrderClick, className }) => {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'all'>('all');
  const [dateRange, setDateRange] = useState('all');

  // Filter orders based on status and date range
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;

    let matchesDate = true;
    if (dateRange !== 'all') {
      const now = new Date();
      const orderDate = new Date(order.createdAt);

      switch (dateRange) {
        case 'today':
          matchesDate = orderDate.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = orderDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = orderDate >= monthAgo;
          break;
      }
    }

    return matchesStatus && matchesDate;
  });

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
        <div>
          <p className="text-sm text-gray-900">{date.toLocaleDateString()}</p>
          <p className="text-xs text-gray-500">{date.toLocaleTimeString()}</p>
        </div>
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
      render: (status: OrderStatus) => <OrderStatusBadge status={status} />,
    },
    {
      key: 'paymentStatus',
      label: 'Payment',
      render: (paymentStatus: Order['paymentStatus']) => {
        const paymentColors = {
          pending: 'bg-yellow-100 text-yellow-800',
          paid: 'bg-green-100 text-green-800',
          failed: 'bg-red-100 text-red-800',
          refunded: 'bg-gray-100 text-gray-800',
        };

        return (
          <span
            className={cn(
              'px-2 py-1 text-xs font-medium rounded-full',
              paymentColors[paymentStatus]
            )}
          >
            {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
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
    {
      label: 'Print',
      icon: 'print',
      onClick: (order: Order) => console.log('Print order:', order.id),
    },
  ];

  const statusOptions: (OrderStatus | 'all')[] = [
    'all',
    'pending',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
  ];
  const dateOptions = ['all', 'today', 'week', 'month'];

  return (
    <div className={cn('space-y-6', className)}>
      {/* Filters */}
      <div className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-soft-card">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Status Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Order Status</label>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={cn(
                    'px-3 py-1 text-sm rounded-full border transition-colors duration-200',
                    selectedStatus === status
                      ? 'bg-admin-primary text-white border-admin-primary'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  )}
                >
                  {status === 'all'
                    ? 'All Orders'
                    : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <div className="flex flex-wrap gap-2">
              {dateOptions.map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={cn(
                    'px-3 py-1 text-sm rounded-full border transition-colors duration-200',
                    dateRange === range
                      ? 'bg-admin-primary text-white border-admin-primary'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  )}
                >
                  {range === 'all'
                    ? 'All Time'
                    : range === 'today'
                      ? 'Today'
                      : range === 'week'
                        ? 'Last 7 Days'
                        : 'Last 30 Days'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-surface-dark rounded-xl shadow-soft-card">
        <DataTable
          columns={orderColumns}
          data={filteredOrders}
          actions={orderActions}
          onRowClick={onOrderClick}
          emptyMessage="No orders found matching your criteria"
        />
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-surface-dark rounded-xl p-4 shadow-soft-card">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {filteredOrders.length}
          </p>
        </div>
        <div className="bg-white dark:bg-surface-dark rounded-xl p-4 shadow-soft-card">
          <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {filteredOrders.filter((o) => o.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white dark:bg-surface-dark rounded-xl p-4 shadow-soft-card">
          <p className="text-sm text-gray-600 dark:text-gray-400">Processing</p>
          <p className="text-2xl font-bold text-blue-600">
            {filteredOrders.filter((o) => o.status === 'processing').length}
          </p>
        </div>
        <div className="bg-white dark:bg-surface-dark rounded-xl p-4 shadow-soft-card">
          <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
          <p className="text-2xl font-bold text-green-600">
            {filteredOrders.filter((o) => o.status === 'delivered').length}
          </p>
        </div>
      </div>
    </div>
  );
};
