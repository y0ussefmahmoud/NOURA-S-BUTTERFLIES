// Review submission utilities
export interface ReviewData {
  productId?: string;
  rating: number;
  title: string;
  content: string;
  recommend: boolean;
  images?: File[];
}

export interface NewsletterData {
  email: string;
}

export interface FeedbackData {
  rating: number;
  glowStory: string;
  images?: File[];
  shareOnSocial: boolean;
}

// Mock API functions
export const submitReview = async (
  data: ReviewData
): Promise<{ success: boolean; message: string }> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Mock validation
  if (!data.title.trim() || !data.content.trim()) {
    return {
      success: false,
      message: 'Please fill in all required fields',
    };
  }

  if (data.rating < 1 || data.rating > 5) {
    return {
      success: false,
      message: 'Please select a valid rating',
    };
  }

  // Store in localStorage for demo purposes
  const reviews = JSON.parse(localStorage.getItem('noura-reviews') || '[]');
  reviews.push({
    id: Date.now().toString(),
    ...data,
    date: new Date().toISOString(),
    verified: true,
  });
  localStorage.setItem('noura-reviews', JSON.stringify(reviews));

  return {
    success: true,
    message: 'Review submitted successfully!',
  };
};

export const subscribeNewsletter = async (
  data: NewsletterData
): Promise<{ success: boolean; message: string }> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return {
      success: false,
      message: 'Please enter a valid email address',
    };
  }

  // Check if already subscribed
  const subscribers = JSON.parse(localStorage.getItem('noura-newsletter-subscribers') || '[]');
  if (subscribers.includes(data.email)) {
    return {
      success: false,
      message: 'Email already subscribed',
    };
  }

  // Store in localStorage for demo purposes
  subscribers.push(data.email);
  localStorage.setItem('noura-newsletter-subscribers', JSON.stringify(subscribers));

  return {
    success: true,
    message: 'Successfully subscribed to newsletter!',
  };
};

export const submitFeedback = async (
  data: FeedbackData
): Promise<{ success: boolean; message: string }> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Mock validation
  if (!data.glowStory.trim()) {
    return {
      success: false,
      message: 'Please share your glow story',
    };
  }

  if (data.rating < 1 || data.rating > 5) {
    return {
      success: false,
      message: 'Please select a valid rating',
    };
  }

  if (data.glowStory.length < 20) {
    return {
      success: false,
      message: 'Glow story must be at least 20 characters',
    };
  }

  if (data.glowStory.length > 1000) {
    return {
      success: false,
      message: 'Glow story must be less than 1000 characters',
    };
  }

  // Store in localStorage for demo purposes
  const feedback = JSON.parse(localStorage.getItem('noura-feedback') || '[]');
  feedback.push({
    id: Date.now().toString(),
    ...data,
    date: new Date().toISOString(),
  });
  localStorage.setItem('noura-feedback', JSON.stringify(feedback));

  return {
    success: true,
    message: 'Feedback submitted successfully!',
  };
};

// Helper function to validate email
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper function to validate review content
export const validateReviewContent = (
  title: string,
  content: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!title.trim()) {
    errors.push('Review title is required');
  } else if (title.length < 5) {
    errors.push('Review title must be at least 5 characters');
  } else if (title.length > 100) {
    errors.push('Review title must be less than 100 characters');
  }

  if (!content.trim()) {
    errors.push('Review content is required');
  } else if (content.length < 20) {
    errors.push('Review content must be at least 20 characters');
  } else if (content.length > 1000) {
    errors.push('Review content must be less than 1000 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Helper function to format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
