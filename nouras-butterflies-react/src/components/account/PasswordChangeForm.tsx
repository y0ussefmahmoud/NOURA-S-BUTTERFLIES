import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { validatePassword } from '../../utils/validation';

interface PasswordChangeFormProps {
  onSubmit: (data: { currentPassword: string; newPassword: string }) => void;
  isLoading?: boolean;
}

export const PasswordChangeForm: React.FC<PasswordChangeFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, label: '', color: '' };

    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    score = Object.values(checks).filter(Boolean).length;

    const strengthLevels = [
      { score: 0, label: 'Very Weak', color: 'bg-red-500' },
      { score: 1, label: 'Weak', color: 'bg-red-400' },
      { score: 2, label: 'Fair', color: 'bg-yellow-500' },
      { score: 3, label: 'Good', color: 'bg-blue-500' },
      { score: 4, label: 'Strong', color: 'bg-green-500' },
      { score: 5, label: 'Very Strong', color: 'bg-green-600' },
    ];

    return strengthLevels[Math.min(score, 5)];
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (!validatePassword(formData.newPassword)) {
      newErrors.newPassword = 'Password must be at least 8 characters with letters and numbers';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSubmit({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    });
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-serif text-gray-900 mb-6">Change Password</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Password */}
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Current Password
          </label>
          <div className="relative">
            <input
              id="currentPassword"
              type={showPasswords.current ? 'text' : 'password'}
              value={formData.currentPassword}
              onChange={(e) => handleInputChange('currentPassword', e.target.value)}
              className={`
                w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent
                ${errors.currentPassword ? 'border-red-500' : 'border-gray-300'}
              `}
              placeholder="Enter current password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('current')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <span className="material-symbols-rounded">
                {showPasswords.current ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
          {errors.currentPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              id="newPassword"
              type={showPasswords.new ? 'text' : 'password'}
              value={formData.newPassword}
              onChange={(e) => handleInputChange('newPassword', e.target.value)}
              className={`
                w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent
                ${errors.newPassword ? 'border-red-500' : 'border-gray-300'}
              `}
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('new')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <span className="material-symbols-rounded">
                {showPasswords.new ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
          {errors.newPassword && <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>}

          {/* Password Strength Indicator */}
          {formData.newPassword && (
            <div className="mt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">Password Strength</span>
                <span
                  className="text-xs font-medium"
                  style={{ color: passwordStrength.color.replace('bg-', 'text-') }}
                >
                  {passwordStrength.label}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                  style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                />
              </div>
              <div className="mt-2 text-xs text-gray-500">
                <p>Password must contain:</p>
                <ul className="mt-1 space-y-1">
                  <li
                    className={
                      formData.newPassword.length >= 8 ? 'text-green-600' : 'text-gray-400'
                    }
                  >
                    ✓ At least 8 characters
                  </li>
                  <li
                    className={
                      /[a-z]/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-400'
                    }
                  >
                    ✓ Lowercase letters
                  </li>
                  <li
                    className={
                      /[A-Z]/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-400'
                    }
                  >
                    ✓ Uppercase letters
                  </li>
                  <li
                    className={/\d/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-400'}
                  >
                    ✓ Numbers
                  </li>
                  <li
                    className={
                      /[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword)
                        ? 'text-green-600'
                        : 'text-gray-400'
                    }
                  >
                    ✓ Special characters
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showPasswords.confirm ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className={`
                w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent
                ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}
              `}
              placeholder="Confirm new password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirm')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <span className="material-symbols-rounded">
                {showPasswords.confirm ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-4">
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
                Updating Password...
              </span>
            ) : (
              'Update Password'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
