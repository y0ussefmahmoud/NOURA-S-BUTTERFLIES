// Mock authentication API functions for testing and development

export const mockLogin = async (email: string, password: string) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock validation
  if (email === 'user@example.com' && password === 'password') {
    return {
      user: {
        id: '1',
        name: 'Sarah Johnson',
        email: 'user@example.com',
        avatar: '/api/placeholder/150/150',
        membershipTier: 'gold' as const,
        points: 1250,
        phone: '+966 50 123 4567',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      token: 'mock-jwt-token-' + Date.now(),
      message: 'Login successful',
    };
  }

  throw new Error('Invalid email or password');
};

export const mockRegister = async (userData: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const user = {
    id: Date.now().toString(),
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    membershipTier: 'bronze' as const,
    points: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return {
    user,
    token: 'mock-jwt-token-' + Date.now(),
    message: 'Registration successful',
  };
};

export const mockGetUser = async (token: string) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock token validation
  if (token.startsWith('mock-jwt-token-')) {
    return {
      id: '1',
      name: 'Sarah Johnson',
      email: 'user@example.com',
      avatar: '/api/placeholder/150/150',
      membershipTier: 'gold' as const,
      points: 1250,
      phone: '+966 50 123 4567',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  throw new Error('Invalid token');
};

export const mockUpdateProfile = async (
  token: string,
  updates: {
    name?: string;
    email?: string;
    phone?: string;
  }
) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock token validation
  if (!token.startsWith('mock-jwt-token-')) {
    throw new Error('Invalid token');
  }

  // Return updated user
  return {
    id: '1',
    name: updates.name || 'Sarah Johnson',
    email: updates.email || 'user@example.com',
    avatar: '/api/placeholder/150/150',
    membershipTier: 'gold' as const,
    points: 1250,
    phone: updates.phone || '+966 50 123 4567',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const mockChangePassword = async (
  token: string,
  currentPassword: string,
  newPassword: string
) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Mock token validation
  if (!token.startsWith('mock-jwt-token-')) {
    throw new Error('Invalid token');
  }

  // Mock password validation
  if (currentPassword !== 'password') {
    throw new Error('Current password is incorrect');
  }

  // Mock password change success
  return {
    message: 'Password changed successfully',
  };
};

export const mockLogout = async (token: string) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock token validation
  if (!token.startsWith('mock-jwt-token-')) {
    throw new Error('Invalid token');
  }

  return {
    message: 'Logout successful',
  };
};
