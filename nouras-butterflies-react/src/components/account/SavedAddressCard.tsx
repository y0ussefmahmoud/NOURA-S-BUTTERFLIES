import React, { useState } from 'react';
import type { SavedAddress } from '../../types/user';

interface SavedAddressCardProps {
  address: SavedAddress;
  onEdit: (address: SavedAddress) => void;
  onDelete: (addressId: string) => void;
  onSetDefault: (addressId: string) => void;
  isDefault?: boolean;
}

export const SavedAddressCard: React.FC<SavedAddressCardProps> = ({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  isDefault = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getAddressIcon = (label: string) => {
    switch (label) {
      case 'home':
        return 'home';
      case 'work':
        return 'work';
      default:
        return 'location_on';
    }
  };

  const getLabelColor = (label: string) => {
    switch (label) {
      case 'home':
        return 'bg-blue-100 text-blue-700';
      case 'work':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Default Badge */}
      {isDefault && (
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-700">
            <span className="material-symbols-rounded text-xs mr-1">star</span>
            Default
          </span>
        </div>
      )}

      {/* Address Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="material-symbols-rounded text-gray-400">
            {getAddressIcon(address.label)}
          </span>
          <span
            className={`
              inline-flex items-center px-2 py-1 rounded text-xs font-medium
              ${getLabelColor(address.label)}
            `}
          >
            {address.label.charAt(0).toUpperCase() + address.label.slice(1)}
          </span>
        </div>
      </div>

      {/* Address Details */}
      <div className="space-y-1">
        <h4 className="font-medium text-gray-900">{address.fullName}</h4>
        <p className="text-sm text-gray-600">{address.phone}</p>
        <p className="text-sm text-gray-600">{address.streetAddress}</p>
        <p className="text-sm text-gray-600">
          {address.city}, {address.postalCode}
        </p>
        <p className="text-sm text-gray-600">{address.country}</p>
      </div>

      {/* Action Buttons */}
      <div
        className={`
        mt-4 pt-3 border-t border-gray-100 flex items-center justify-between
        transition-opacity duration-200
        ${isHovered ? 'opacity-100' : 'opacity-60 lg:opacity-0'}
      `}
      >
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(address)}
            className="flex items-center space-x-1 text-sm text-gray-600 hover:text-pink-600 transition-colors duration-200"
          >
            <span className="material-symbols-rounded text-lg">edit</span>
            <span>Edit</span>
          </button>

          {!isDefault && (
            <button
              onClick={() => onSetDefault(address.id)}
              className="flex items-center space-x-1 text-sm text-gray-600 hover:text-pink-600 transition-colors duration-200"
            >
              <span className="material-symbols-rounded text-lg">star</span>
              <span>Set Default</span>
            </button>
          )}
        </div>

        {!isDefault && (
          <button
            onClick={() => onDelete(address.id)}
            className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700 transition-colors duration-200"
          >
            <span className="material-symbols-rounded text-lg">delete</span>
            <span>Delete</span>
          </button>
        )}
      </div>

      {/* Mobile Action Buttons - Always Visible */}
      <div className="lg:hidden mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(address)}
            className="flex items-center space-x-1 text-sm text-gray-600 hover:text-pink-600 transition-colors duration-200"
          >
            <span className="material-symbols-rounded text-lg">edit</span>
            <span>Edit</span>
          </button>

          {!isDefault && (
            <button
              onClick={() => onSetDefault(address.id)}
              className="flex items-center space-x-1 text-sm text-gray-600 hover:text-pink-600 transition-colors duration-200"
            >
              <span className="material-symbols-rounded text-lg">star</span>
              <span>Set Default</span>
            </button>
          )}
        </div>

        {!isDefault && (
          <button
            onClick={() => onDelete(address.id)}
            className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700 transition-colors duration-200"
          >
            <span className="material-symbols-rounded text-lg">delete</span>
            <span>Delete</span>
          </button>
        )}
      </div>
    </div>
  );
};
