import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { FormField } from '../ui/FormField';
import { AddressAutocomplete } from '../ui/AddressAutocomplete';
import {
  validateName,
  validateAddress,
  validateCity,
  validatePostalCode,
  validatePhone,
  getPhoneErrorMessage,
} from '../../utils/validation';
import { formatPhoneNumber, formatPostalCode } from '../../utils/formatters';
import type { SavedAddress } from '../../types/user';

interface AddressFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: Omit<SavedAddress, 'id' | 'createdAt' | 'updatedAt'>) => void;
  address?: SavedAddress;
}

export const AddressFormModal: React.FC<AddressFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  address,
}) => {
  const [formData, setFormData] = useState({
    label: 'home' as 'home' | 'work' | 'other',
    isDefault: false,
    fullName: '',
    phone: '',
    streetAddress: '',
    city: '',
    postalCode: '',
    country: 'Saudi Arabia',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [manualAddressEntry, setManualAddressEntry] = useState(false);

  // Initialize form with address data if editing
  useEffect(() => {
    if (address) {
      setFormData({
        label: address.label,
        isDefault: address.isDefault,
        fullName: address.fullName,
        phone: address.phone,
        streetAddress: address.streetAddress,
        city: address.city,
        postalCode: address.postalCode,
        country: address.country,
      });
    } else {
      // Reset form for new address
      setFormData({
        label: 'home',
        isDefault: false,
        fullName: '',
        phone: '',
        streetAddress: '',
        city: '',
        postalCode: '',
        country: 'Saudi Arabia',
      });
    }
    setErrors({});
  }, [address, isOpen]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!validateName(formData.fullName).isValid) {
      newErrors.fullName = 'Please enter a valid full name';
    }

    if (!validatePhone(formData.phone).isValid) {
      newErrors.phone = getPhoneErrorMessage(formData.phone) || 'Please enter a valid phone number';
    }

    if (!validateAddress(formData.streetAddress).isValid) {
      newErrors.streetAddress = 'Please enter a valid street address';
    }

    if (!validateCity(formData.city).isValid) {
      newErrors.city = 'Please enter a valid city name';
    }

    if (!validatePostalCode(formData.postalCode)) {
      newErrors.postalCode = 'Please enter a valid 5-digit postal code';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onSave({
        label: formData.label,
        isDefault: formData.isDefault,
        fullName: formData.fullName,
        phone: formData.phone,
        streetAddress: formData.streetAddress,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
      });

      onClose();
    } catch (error) {
      console.error('Error saving address:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-serif text-gray-900">
              {address ? 'Edit Address' : 'Add New Address'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <span className="material-symbols-rounded text-gray-500">close</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Address Label */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Label
                </label>
                <div className="flex space-x-4">
                  {(['home', 'work', 'other'] as const).map((label) => (
                    <label key={label} className="flex items-center">
                      <input
                        type="radio"
                        name="label"
                        value={label}
                        checked={formData.label === label}
                        onChange={(e) => handleInputChange('label', e.target.value)}
                        className="mr-2 text-pink-600 focus:ring-pink-500"
                      />
                      <span className="text-sm text-gray-700 capitalize">
                        {label === 'other' ? 'Other' : label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Set as Default */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) => handleInputChange('isDefault', e.target.checked)}
                  className="mr-2 text-pink-600 focus:ring-pink-500 rounded"
                />
                <label htmlFor="isDefault" className="text-sm text-gray-700">
                  Set as default shipping address
                </label>
              </div>

              {/* Full Name */}
              <FormField
                name="fullName"
                label="Full Name"
                value={formData.fullName}
                onChange={(value) => handleInputChange('fullName', value)}
                error={errors.fullName}
                required
                tooltip="Please enter your full legal name"
              />

              {/* Phone */}
              <FormField
                name="phone"
                label="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={(value) => handleInputChange('phone', formatPhoneNumber(value))}
                error={errors.phone}
                required
                placeholder="05X XXX XXXX"
                mask="phone"
                inputMode="tel"
                tooltip="أدخل رقم هاتفك السعودي بصيغة 05XXXXXXXX"
                helperText="سنستخدم هذا الرقم للتواصل معك"
                showExamples
                examples={['05X XXX XXXX', '+966 5X XXX XXXX']}
              />

              {/* Street Address */}
              <div className="md:col-span-2 space-y-3">
                <div className="flex items-center justify-between">
                  {!manualAddressEntry && (
                    <label htmlFor="streetAddress" className="text-sm font-medium text-gray-700">
                      Street Address
                    </label>
                  )}
                  <button
                    type="button"
                    className="text-xs text-pink-600 hover:text-pink-700"
                    onClick={() => setManualAddressEntry((prev) => !prev)}
                  >
                    {manualAddressEntry ? 'Use suggestions' : 'Enter manually'}
                  </button>
                </div>

                {manualAddressEntry ? (
                  <FormField
                    name="streetAddress"
                    label="Street Address"
                    value={formData.streetAddress}
                    onChange={(value) => handleInputChange('streetAddress', value)}
                    error={errors.streetAddress}
                    placeholder="123 Beauty Lane, Apartment 4B"
                    required
                  />
                ) : (
                  <AddressAutocomplete
                    value={formData.streetAddress}
                    onChange={(value) => handleInputChange('streetAddress', value)}
                    onSelect={(selection) => {
                      handleInputChange('streetAddress', selection.address);
                      if (selection.city) handleInputChange('city', selection.city);
                      if (selection.postalCode)
                        handleInputChange('postalCode', selection.postalCode);
                      if (selection.country) handleInputChange('country', selection.country);
                    }}
                    placeholder="Start typing your address"
                    inputId="streetAddress"
                  />
                )}

                {errors.streetAddress && (
                  <p className="text-sm text-red-600">{errors.streetAddress}</p>
                )}
              </div>

              {/* City */}
              <FormField
                name="city"
                label="City"
                value={formData.city}
                onChange={(value) => handleInputChange('city', value)}
                error={errors.city}
                required
                placeholder="Riyadh"
              />

              {/* Postal Code */}
              <FormField
                name="postalCode"
                label="Postal Code"
                value={formData.postalCode}
                onChange={(value) => handleInputChange('postalCode', formatPostalCode(value))}
                error={errors.postalCode}
                required
                placeholder="12345"
                maxLength={5}
                mask="postal"
                inputMode="numeric"
              />

              {/* Country */}
              <div className="md:col-span-2">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <select
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="Saudi Arabia">Saudi Arabia</option>
                  <option value="United Arab Emirates">United Arab Emirates</option>
                  <option value="Qatar">Qatar</option>
                  <option value="Kuwait">Kuwait</option>
                  <option value="Bahrain">Bahrain</option>
                  <option value="Oman">Oman</option>
                </select>
                {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country}</p>}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="text-gray-700 border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isLoading}
                className="bg-pink-500 hover:bg-pink-600 text-white"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    {address ? 'Updating...' : 'Adding...'}
                  </span>
                ) : (
                  <span>{address ? 'Update Address' : 'Add Address'}</span>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
