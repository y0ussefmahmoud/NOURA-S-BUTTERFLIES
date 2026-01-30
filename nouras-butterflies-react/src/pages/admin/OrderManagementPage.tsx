import React, { useState } from 'react';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminTopNav } from '../../components/admin/AdminTopNav';
import { OrdersTable } from '../../components/admin/orders/OrdersTable';
import { OrderDetailsModal } from '../../components/admin/orders/OrderDetailsModal';
import { mockOrders } from '../../data/mockAdmin';
import type { Order, OrderStatus } from '../../types/admin';

const OrderManagementPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    console.log('Updating order status:', orderId, newStatus);
    // Here you would update the order status
    // For now, just log it
  };

  const handlePrintInvoice = (orderId: string) => {
    console.log('Printing invoice for order:', orderId);
    // Here you would trigger the print functionality
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
            <p className="text-gray-600">
              Manage and track customer orders from placement to delivery
            </p>
          </div>

          {/* Orders Table */}
          <OrdersTable orders={mockOrders} onOrderClick={handleOrderClick} />
        </div>
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onUpdateStatus={handleStatusUpdate}
        onPrintInvoice={handlePrintInvoice}
      />

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

export default OrderManagementPage;
