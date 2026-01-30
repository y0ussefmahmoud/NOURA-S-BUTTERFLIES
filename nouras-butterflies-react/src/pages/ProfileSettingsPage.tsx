import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AccountSidebar } from '../components/account/AccountSidebar';
import { AvatarUpload } from '../components/account/AvatarUpload';
import { PasswordChangeForm } from '../components/account/PasswordChangeForm';
import { Button } from '../components/ui/Button';
import { FloatingLabelInput } from '../components/auth/FloatingLabelInput';
import { validateEmail, validateName } from '../utils/validation';

export const ProfileSettingsPage: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});

  const handleProfileInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (profileErrors[field]) {
      setProfileErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateProfileForm = () => {
    const errors: Record<string, string> = {};

    if (!validateName(profileData.name)) {
      errors.name = 'Please enter a valid name';
    }

    if (!validateEmail(profileData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateProfileForm()) return;

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await updateProfile({
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
      });

      setSuccessMessage('Profile updated successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // TODO: Implement actual password change API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccessMessage('Password changed successfully!');
      setActiveTab('profile');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('Current password is incorrect. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = (file: File) => {
    // TODO: Implement actual avatar upload
    console.log('Avatar upload:', file.name);
    setSuccessMessage('Avatar uploaded successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleAvatarRemove = () => {
    // TODO: Implement actual avatar removal
    console.log('Avatar removed');
    setSuccessMessage('Avatar removed successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">Profile Settings</h1>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <span className="material-symbols-rounded text-gray-600">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`
          fixed lg:relative inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        >
          <div className="h-full overflow-y-auto">
            <AccountSidebar
              user={user}
              isMobile={true}
              onClose={() => setIsMobileMenuOpen(false)}
              onLogout={handleLogout}
            />
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Success/Error Messages */}
            {successMessage && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                <div className="flex items-center">
                  <span className="material-symbols-rounded text-green-600 mr-2">check_circle</span>
                  {successMessage}
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                <div className="flex items-center">
                  <span className="material-symbols-rounded text-red-600 mr-2">error</span>
                  {errorMessage}
                </div>
              </div>
            )}

            {/* Tab Navigation */}
            <div className="mb-8">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`
                      py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                      ${
                        activeTab === 'profile'
                          ? 'border-pink-500 text-pink-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    Personal Information
                  </button>
                  <button
                    onClick={() => setActiveTab('password')}
                    className={`
                      py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                      ${
                        activeTab === 'password'
                          ? 'border-pink-500 text-pink-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    Password & Security
                  </button>
                </nav>
              </div>
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-8">
                {/* Avatar Upload */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-serif text-gray-900 mb-6">Profile Picture</h3>
                  <AvatarUpload
                    currentAvatar={user.avatar}
                    onUpload={handleAvatarUpload}
                    onRemove={handleAvatarRemove}
                  />
                </div>

                {/* Personal Information Form */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-serif text-gray-900 mb-6">Personal Information</h3>

                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FloatingLabelInput
                        label="Full Name"
                        value={profileData.name}
                        onChange={(value) => handleProfileInputChange('name', value)}
                        error={profileErrors.name}
                        required
                      />

                      <FloatingLabelInput
                        label="Email Address"
                        type="email"
                        value={profileData.email}
                        onChange={(value) => handleProfileInputChange('email', value)}
                        error={profileErrors.email}
                        required
                      />

                      <FloatingLabelInput
                        label="Phone Number"
                        type="text"
                        value={profileData.phone}
                        onChange={(value) => handleProfileInputChange('phone', value)}
                        placeholder="+966 50 123 4567"
                      />
                    </div>

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
                            Saving...
                          </span>
                        ) : (
                          'Save Changes'
                        )}
                      </Button>
                    </div>
                  </form>
                </div>

                {/* Account Actions */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-serif text-gray-900 mb-6">Account Actions</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Delete Account</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Permanently delete your account and all associated data
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <PasswordChangeForm onSubmit={handlePasswordSubmit} isLoading={isLoading} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
