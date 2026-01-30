import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminTopNav } from '../../components/admin/AdminTopNav';
import { DataTable } from '../../components/admin/DataTable';
import { mockAdminProducts } from '../../data/mockAdmin';
import { cn } from '../../utils/cn';
import type { DataTableColumn, AdminProduct } from '../../types/admin';

const ProductManagementPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Filter products based on search and filters
  const filteredProducts = mockAdminProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'active' && product.inventory.quantity > 0) ||
      (selectedStatus === 'out' && product.inventory.quantity === 0) ||
      (selectedStatus === 'low' &&
        product.inventory.quantity <= product.inventory.lowStockThreshold);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Product table columns
  const productColumns: DataTableColumn<AdminProduct>[] = [
    {
      key: 'images',
      label: 'Image',
      render: (images: AdminProduct['images']) => (
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
          {images && images.length > 0 ? (
            <img
              src={images[0].url}
              alt="Product"
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <span className="material-symbols-outlined text-gray-400">image</span>
          )}
        </div>
      ),
    },
    {
      key: 'name',
      label: 'Product Name',
      sortable: true,
      render: (name: string, product: AdminProduct) => (
        <div>
          <Link
            to={`/admin/products/${product.id}/edit`}
            className="font-medium text-admin-primary hover:text-admin-primary/80"
          >
            {name}
          </Link>
          <p className="text-sm text-gray-500">SKU: {product.sku}</p>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
    },
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      render: (price: number) => (
        <span className="font-medium text-gray-900">${price.toFixed(2)}</span>
      ),
    },
    {
      key: 'inventory',
      label: 'Stock',
      sortable: true,
      render: (inventory: AdminProduct['inventory']) => (
        <div>
          <span
            className={cn(
              'font-medium',
              inventory.quantity === 0
                ? 'text-red-600'
                : inventory.quantity <= inventory.lowStockThreshold
                  ? 'text-yellow-600'
                  : 'text-green-600'
            )}
          >
            {inventory.quantity}
          </span>
          <p className="text-xs text-gray-500">Threshold: {inventory.lowStockThreshold}</p>
        </div>
      ),
    },
    {
      key: 'customStatus',
      label: 'Status',
      render: (_, product: AdminProduct) => {
        const inventory = product.inventory;
        let status = 'active';
        let statusColor = 'bg-green-100 text-green-800';

        if (inventory.quantity === 0) {
          status = 'out of stock';
          statusColor = 'bg-red-100 text-red-800';
        } else if (inventory.quantity <= inventory.lowStockThreshold) {
          status = 'low stock';
          statusColor = 'bg-yellow-100 text-yellow-800';
        }

        return (
          <span className={cn('px-2 py-1 text-xs font-medium rounded-full', statusColor)}>
            {status}
          </span>
        );
      },
    },
  ];

  const productActions = [
    {
      label: 'Edit',
      icon: 'edit',
      onClick: (product: AdminProduct) => console.log('Edit product:', product.id),
    },
    {
      label: 'Duplicate',
      icon: 'content_copy',
      onClick: (product: AdminProduct) => console.log('Duplicate product:', product.id),
    },
    {
      label: 'Delete',
      icon: 'delete',
      variant: 'danger' as const,
      onClick: (product: AdminProduct) => console.log('Delete product:', product.id),
    },
  ];

  const categories = ['all', ...Array.from(new Set(mockAdminProducts.map((p) => p.category)))];
  const stats = {
    total: mockAdminProducts.length,
    active: mockAdminProducts.filter((p) => p.inventory.quantity > 0).length,
    lowStock: mockAdminProducts.filter(
      (p) => p.inventory.quantity <= p.inventory.lowStockThreshold && p.inventory.quantity > 0
    ).length,
    outOfStock: mockAdminProducts.filter((p) => p.inventory.quantity === 0).length,
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Management</h1>
              <p className="text-gray-600">Manage your product catalog, inventory, and pricing</p>
            </div>
            <Link
              to="/admin/products/new"
              className="px-4 py-2 bg-admin-primary text-white rounded-lg hover:bg-admin-primary/90 transition-colors duration-200 flex items-center gap-2"
            >
              <span className="material-symbols-outlined">add</span>
              Add New Product
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-soft-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Products
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-600">inventory_2</span>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-soft-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</p>
                  <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-green-600">check_circle</span>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-soft-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Low Stock</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.lowStock}</p>
                </div>
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-yellow-600">warning</span>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-soft-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Out of Stock
                  </p>
                  <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
                </div>
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-red-600">cancel</span>
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
                    placeholder="Search products by name or SKU..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary/20"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary/20"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary/20"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="low">Low Stock</option>
                  <option value="out">Out of Stock</option>
                </select>
              </div>

              {/* Bulk Actions */}
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  Bulk Edit
                </button>
                <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white dark:bg-surface-dark rounded-xl shadow-soft-card">
            <DataTable
              columns={productColumns}
              data={filteredProducts}
              actions={productActions}
              onRowClick={(product) => console.log('Row clicked:', product)}
              emptyMessage="No products found matching your criteria"
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

export default ProductManagementPage;
