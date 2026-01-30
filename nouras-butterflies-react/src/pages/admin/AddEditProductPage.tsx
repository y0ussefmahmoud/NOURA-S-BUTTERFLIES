import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminTopNav } from '../../components/admin/AdminTopNav';
import { cn } from '../../utils/cn';
import type { ProductFormData } from '../../types/admin';

const AddEditProductPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    ingredients: '',
    category: 'Soaps',
    sku: '',
    basePrice: 0,
    discountPercentage: 0,
    images: [],
    isVegan: false,
    isNatural: false,
    showOnHomepage: false,
    inventory: {
      quantity: 0,
      lowStockThreshold: 10,
      trackQuantity: true,
      allowBackorder: false,
    },
    cost: 0,
    supplier: {
      name: '',
      contact: '',
      leadTime: 7,
    },
    seo: {
      title: '',
      description: '',
      keywords: [],
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = ['Soaps', 'Bath Bombs', 'Lotions', 'Candles', 'Gift Sets'];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (formData.basePrice <= 0) newErrors.basePrice = 'Price must be greater than 0';
    if (formData.inventory.quantity < 0) newErrors.quantity = 'Stock cannot be negative';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', formData);
      // Here you would save the product
      navigate('/admin/products');
    }
  };

  const handleSaveDraft = () => {
    console.log('Draft saved:', formData);
    navigate('/admin/products');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const isEditing = !!id;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Navigation */}
        <AdminTopNav />

        {/* Page Content */}
        <div className="p-6 pb-24">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <button onClick={() => navigate('/admin/products')} className="hover:text-gray-900">
              Products
            </button>
            <span>/</span>
            <span className="text-gray-900">{isEditing ? 'Edit Product' : 'Add New Product'}</span>
          </div>

          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {isEditing ? 'Edit Product' : 'Add New Product'}
              </h1>
              <p className="text-gray-600">
                {isEditing
                  ? 'Update product information and settings'
                  : 'Create a new product for your store'}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSaveDraft}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Save Draft
              </button>
              <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                Preview
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Product Gallery & Attributes */}
            <div className="lg:col-span-5 space-y-6">
              {/* Product Gallery */}
              <div className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-soft-card">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Product Gallery
                </h2>

                {/* Main Image Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-admin-primary transition-colors duration-200 cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <span className="material-symbols-outlined text-4xl text-gray-400 mb-2 block">
                      cloud_upload
                    </span>
                    <p className="text-gray-600 font-medium">Click to upload images</p>
                    <p className="text-sm text-gray-500 mt-1">or drag and drop</p>
                    <p className="text-xs text-gray-400 mt-2">PNG, JPG up to 10MB</p>
                  </label>
                </div>

                {/* Thumbnail Grid */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                        >
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Attributes */}
              <div className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-soft-card">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Product Attributes
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-admin-primary">eco</span>
                      <div>
                        <p className="font-medium text-gray-900">Is Vegan</p>
                        <p className="text-sm text-gray-500">
                          Product contains no animal-derived ingredients
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isVegan}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, isVegan: e.target.checked }))
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-admin-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-admin-primary" />
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-admin-primary">spa</span>
                      <div>
                        <p className="font-medium text-gray-900">Is Natural</p>
                        <p className="text-sm text-gray-500">Made with natural ingredients</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isNatural}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, isNatural: e.target.checked }))
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-admin-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-admin-primary" />
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-admin-primary">home</span>
                      <div>
                        <p className="font-medium text-gray-900">Show on Homepage</p>
                        <p className="text-sm text-gray-500">
                          Display on the homepage featured section
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.showOnHomepage}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, showOnHomepage: e.target.checked }))
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-admin-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-admin-primary" />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Product Information */}
            <div className="lg:col-span-7 space-y-6">
              {/* General Information */}
              <div className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-soft-card">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  General Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      className={cn(
                        'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary/20',
                        errors.name ? 'border-red-500' : 'border-gray-200'
                      )}
                      placeholder="Enter product name"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, category: e.target.value }))
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary/20"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SKU <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) => setFormData((prev) => ({ ...prev, sku: e.target.value }))}
                      className={cn(
                        'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary/20',
                        errors.sku ? 'border-red-500' : 'border-gray-200'
                      )}
                      placeholder="Enter SKU"
                    />
                    {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Base Price <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.basePrice}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          basePrice: parseFloat(e.target.value) || 0,
                        }))
                      }
                      className={cn(
                        'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary/20',
                        errors.basePrice ? 'border-red-500' : 'border-gray-200'
                      )}
                      placeholder="0.00"
                    />
                    {errors.basePrice && (
                      <p className="text-red-500 text-sm mt-1">{errors.basePrice}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discount %
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.discountPercentage}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          discountPercentage: parseFloat(e.target.value) || 0,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary/20"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-soft-card">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Description
                </h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, description: e.target.value }))
                    }
                    rows={4}
                    className={cn(
                      'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary/20',
                      errors.description ? 'border-red-500' : 'border-gray-200'
                    )}
                    placeholder="Enter product description"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                  )}
                </div>
              </div>

              {/* Ingredients */}
              <div className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-soft-card">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Ingredients
                </h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ingredients List
                  </label>
                  <textarea
                    value={formData.ingredients}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, ingredients: e.target.value }))
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary/20"
                    placeholder="List ingredients separated by commas"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Floating Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-200 p-4 lg:ml-64">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full" />
              <span className="text-sm text-gray-600">Draft</span>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-4 py-2 bg-admin-primary text-white rounded-lg hover:bg-admin-primary/90 transition-colors duration-200"
              >
                Save Product
              </button>
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

export default AddEditProductPage;
