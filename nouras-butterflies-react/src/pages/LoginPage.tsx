import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FloatingLabelInput } from '../components/auth/FloatingLabelInput';
import { SocialLoginButtons } from '../components/auth/SocialLoginButtons';
import { Button } from '../components/ui/Button';
import { validateEmail, validatePassword } from '../utils/validation';

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
  name?: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  name?: string;
  general?: string;
}

export const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    rememberMe: false,
    name: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, register, isLoading, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we should start with register tab
  useEffect(() => {
    // Check pathname first - /register should show register form
    if (location.pathname === '/register') {
      setIsLogin(false);
    } else {
      // Fall back to query parameter for backward compatibility
      const params = new URLSearchParams(location.search);
      if (params.get('tab') === 'register') {
        setIsLogin(false);
      }
    }
  }, [location.pathname, location.search]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = sessionStorage.getItem('nouras-redirect-path') || '/account';
      sessionStorage.removeItem('nouras-redirect-path');
      navigate(redirectPath);
    }
  }, [isAuthenticated, navigate]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    if (!isLogin && !formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    clearError();

    try {
      if (isLogin) {
        await login({
          email: formData.email,
          password: formData.password,
          rememberMe: formData.rememberMe,
        });
      } else {
        await register({
          name: formData.name!,
          email: formData.email,
          password: formData.password,
        });
      }
    } catch (err) {
      // Error is handled by AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSocialLogin = (provider: 'google' | 'apple') => {
    // TODO: Implement social login
    console.log(`${provider} login not implemented yet`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left side - Hero Image (Desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-pink-100 to-purple-100 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-12">
            <div className="mb-8">
              <span className="material-symbols-rounded text-8xl text-pink-500">flutter_dash</span>
            </div>
            <h1 className="text-4xl font-serif text-gray-800 mb-4">
              Welcome to Noura's Butterflies
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Discover our exquisite collection of butterfly-inspired beauty products
            </p>
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-500">500+</div>
                <div className="text-sm text-gray-600">Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-500">50K+</div>
                <div className="text-sm text-gray-600">Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-500">4.9★</div>
                <div className="text-sm text-gray-600">Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <Link to="/" className="inline-block">
              <span className="material-symbols-rounded text-4xl text-pink-500">flutter_dash</span>
            </Link>
            <h2 className="mt-6 text-3xl font-serif text-gray-900">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                  clearError();
                }}
                className="font-medium text-pink-600 hover:text-pink-500"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          {/* Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {!isLogin && (
              <FloatingLabelInput
                label="Full Name"
                value={formData.name || ''}
                onChange={(value) => handleInputChange('name', value)}
                error={errors.name}
                required
              />
            )}

            <FloatingLabelInput
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(value) => handleInputChange('email', value)}
              error={errors.email}
              required
            />

            <FloatingLabelInput
              label="Password"
              type="password"
              value={formData.password}
              onChange={(value) => handleInputChange('password', value)}
              error={errors.password}
              required
            />

            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                    className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <button type="button" className="text-sm text-pink-600 hover:text-pink-500">
                  Forgot password?
                </button>
              </div>
            )}

            <SocialLoginButtons
              onGoogleLogin={() => handleSocialLogin('google')}
              onAppleLogin={() => handleSocialLogin('apple')}
            />

            <Button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3"
            >
              {isSubmitting || isLoading ? (
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
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </span>
              ) : (
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              )}
            </Button>
          </form>

          {/* Mobile Hero Section */}
          <div className="lg:hidden mt-12 text-center">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-pink-500">500+</div>
                <div className="text-xs text-gray-600">Products</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-pink-500">50K+</div>
                <div className="text-xs text-gray-600">Customers</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-pink-500">4.9★</div>
                <div className="text-xs text-gray-600">Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
