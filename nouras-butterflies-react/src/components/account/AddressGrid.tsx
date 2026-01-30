import React, { useState } from 'react';
import { SavedAddressCard } from './SavedAddressCard';
import { AddressFormModal } from './AddressFormModal';
import type { SavedAddress } from '../../types/user';

interface AddressGridProps {
  addresses: SavedAddress[];
  onEdit: (address: SavedAddress) => void;
  onDelete: (addressId: string) => void;
  onAdd: (address: Omit<SavedAddress, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onSetDefault: (addressId: string) => void;
}

export const AddressGrid: React.FC<AddressGridProps> = ({
  addresses,
  onEdit,
  onDelete,
  onAdd,
  onSetDefault,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<SavedAddress | undefined>();

  const handleAddNew = () => {
    setEditingAddress(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (address: SavedAddress) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingAddress(undefined);
  };

  const handleSave = (addressData: Omit<SavedAddress, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingAddress) {
      // Update existing address
      onEdit({
        ...addressData,
        id: editingAddress.id,
        createdAt: editingAddress.createdAt,
        updatedAt: new Date().toISOString(),
      });
    } else {
      // Add new address
      onAdd({
        ...addressData,
        id: `address-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as SavedAddress);
    }
  };

  return (
    <div>
      {/* Address Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Add New Address Card */}
        <button
          onClick={handleAddNew}
          className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-pink-400 hover:bg-pink-50 transition-all duration-200 group"
        >
          <div className="flex flex-col items-center justify-center h-full min-h-[200px]">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-pink-100 transition-colors duration-200">
              <span className="material-symbols-rounded text-2xl text-gray-400 group-hover:text-pink-500 transition-colors duration-200">
                add
              </span>
            </div>
            <h3 className="text-lg font-medium text-gray-700 group-hover:text-pink-600 transition-colors duration-200">
              Add New Address
            </h3>
            <p className="text-sm text-gray-500 mt-1 text-center">Save a new shipping address</p>
          </div>
        </button>

        {/* Existing Addresses */}
        {addresses.map((address) => (
          <SavedAddressCard
            key={address.id}
            address={address}
            onEdit={handleEdit}
            onDelete={onDelete}
            onSetDefault={onSetDefault}
            isDefault={address.isDefault}
          />
        ))}
      </div>

      {/* Empty State */}
      {addresses.length === 0 && (
        <div className="text-center py-12">
          <div className="mb-6">
            <span className="material-symbols-rounded text-6xl text-gray-300">location_on</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No saved addresses</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Save your shipping addresses to make checkout faster and easier.
          </p>
          <button
            onClick={handleAddNew}
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Add Your First Address
          </button>
        </div>
      )}

      {/* Address Form Modal */}
      <AddressFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleSave}
        address={editingAddress}
      />
    </div>
  );
};
