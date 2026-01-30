import type {
  ReactNode,
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';

// Base component props
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

// Button component types
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  'aria-label'?: string;
  'aria-describedby'?: string;
  pressed?: boolean;
  expanded?: boolean;
}

// Input component types
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  variant?: 'default' | 'search' | 'rounded';
  size?: 'sm' | 'md' | 'lg';
  error?: string | boolean;
  success?: boolean;
  disabled?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  label?: string;
  helperText?: string;
  sanitize?: boolean;
  allowedCharacters?: RegExp;
}

// Textarea component types
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  rows?: number;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  autoGrow?: boolean;
  error?: string | boolean;
  success?: boolean;
  disabled?: boolean;
  label?: string;
  helperText?: string;
  sanitize?: boolean;
  maxLength?: number;
}

// Card component types
export interface CardProps extends BaseComponentProps {
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

export interface CardHeaderProps extends BaseComponentProps {
  divider?: boolean;
}

export interface CardBodyProps extends BaseComponentProps {}

export interface CardFooterProps extends BaseComponentProps {
  divider?: boolean;
}

export interface CardImageProps extends BaseComponentProps {
  src: string;
  alt: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape';
}

// Badge component types
export interface BadgeProps extends BaseComponentProps {
  variant?: 'primary' | 'gold' | 'success' | 'warning' | 'error' | 'info' | 'new' | 'bestseller';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  icon?: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
}

// Rating component types
export interface RatingProps extends BaseComponentProps {
  value: number;
  max?: number;
  precision?: number;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
  onChange?: (value: number) => void;
  showValue?: boolean;
  reviewCount?: number;
  color?: string;
}

// Icon component types
export interface IconProps extends BaseComponentProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  fill?: boolean;
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
  grade?: number;
  color?: string;
  shouldFlipRTL?: boolean;
  onClick?: () => void;
}

// Modal component types
export interface ModalProps extends BaseComponentProps {
  /**
   * Whether the modal is open
   */
  open?: boolean;
  /** @deprecated Use `open` instead */
  isOpen?: boolean;
  /**
   * Callback when the modal is closed
   */
  onClose: () => void;
  /**
   * Size of the modal
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /**
   * Whether to close the modal when clicking on the overlay
   * @default true
   */
  closeOnOverlayClick?: boolean;
  /**
   * Whether to close the modal when pressing the escape key
   * @default true
   */
  closeOnEscape?: boolean;
  /**
   * Whether to show the close button
   * @default true
   */
  showCloseButton?: boolean;
  /**
   * Whether to prevent scrolling when the modal is open
   * @default true
   */
  preventScroll?: boolean;
  /**
   * Additional class name for the modal overlay
   */
  overlayClassName?: string;
  /**
   * Modal title for accessibility (announced to screen readers)
   */
  title?: string;
  /**
   * Modal description for accessibility
   */
  description?: string;
}

export interface ModalHeaderProps extends BaseComponentProps {
  onClose?: () => void;
}

export interface ModalBodyProps extends BaseComponentProps {}

export interface ModalFooterProps extends BaseComponentProps {}
