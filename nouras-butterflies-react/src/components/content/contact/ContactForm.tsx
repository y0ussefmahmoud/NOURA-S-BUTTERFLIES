import React, { useState } from 'react';
import { Button, Input, Textarea } from '../../ui';
import { useFormValidation, type ValidationRules } from '../../../hooks/useFormValidation';
import { sanitizeFormData, sanitizeInput, sanitizeHTML } from '../../../utils/sanitization';
import { http } from '../../../utils/httpInterceptor';
import { rateLimiters } from '../../../utils/rateLimiter';

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationRules: ValidationRules = {
    fullName: {
      required: true,
      minLength: 2,
      maxLength: 100,
    },
    email: {
      required: true,
      email: true,
    },
    subject: {
      required: true,
      minLength: 5,
      maxLength: 200,
    },
    message: {
      required: true,
      minLength: 10,
      maxLength: 1000,
    },
  };

  const { errors, validateField, validateForm, clearErrors, clearFieldError, setFieldError } =
    useFormValidation(validationRules);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Sanitize input before setting state
    const sanitizedValue = sanitizeInput(value);

    setFormData((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }));

    // Validate field on change and update error state
    const error = validateField(name, sanitizedValue);
    if (error) {
      setFieldError(name, error);
    } else {
      clearFieldError(name);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check rate limit before processing
    if (!rateLimiters.form.checkLimit('contact-form')) {
      alert('Too many form submissions. Please try again later.');
      return;
    }

    // Validate entire form
    if (!validateForm(formData)) {
      return;
    }

    // Sanitize all form data before submission
    const sanitizedData = sanitizeFormData(formData);

    // Additional sanitization for rich text content
    if (sanitizedData.message) {
      sanitizedData.message = sanitizeHTML(sanitizedData.message);
    }

    setIsSubmitting(true);

    try {
      console.log('Contact form submission:', sanitizedData);

      // Send sanitized data to API
      await http.post('/api/contact', sanitizedData);

      // Record successful request for rate limiting
      rateLimiters.form.recordSuccess('contact-form');

      alert('Thank you for your message! We will get back to you soon.');
      setFormData({ fullName: '', email: '', subject: '', message: '' });
      clearErrors();
    } catch (error) {
      console.error('Form submission error:', error);

      // Record failed request for rate limiting
      rateLimiters.form.recordFailure('contact-form');

      alert('There was an error sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="lg:w-7/12 p-8 lg:p-12 bg-gray-50 dark:bg-gray-800">
      <h2 className="font-serif text-2xl md:text-3xl text-gray-900 dark:text-white mb-8">
        Send us a Message
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <Input
            name="fullName"
            label="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="form-input-elegant"
            error={errors.fullName || undefined}
          />
          <Input
            name="email"
            type="email"
            label="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-input-elegant"
            error={errors.email || undefined}
          />
        </div>

        <Input
          name="subject"
          label="Subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="form-input-elegant"
          error={errors.subject || undefined}
        />

        <Textarea
          name="message"
          label="Message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
          className="form-input-elegant"
          error={errors.message || undefined}
        />

        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="w-full md:w-auto btn-gold-hover"
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
      </form>
    </div>
  );
};
