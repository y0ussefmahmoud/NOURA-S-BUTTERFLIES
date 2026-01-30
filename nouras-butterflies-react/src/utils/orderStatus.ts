// Helper functions for order status display and management

export type OrderStatus = 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface StatusConfig {
  label: string;
  color: string;
  icon: string;
  description: string;
  progressPercentage: number;
}

// Status configuration
const statusConfig: Record<OrderStatus, StatusConfig> = {
  processing: {
    label: 'Processing',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: 'pending',
    description: "We're preparing your order",
    progressPercentage: 20,
  },
  shipped: {
    label: 'Shipped',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: 'local_shipping',
    description: 'Your order is on its way',
    progressPercentage: 50,
  },
  out_for_delivery: {
    label: 'Out for Delivery',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: 'delivery_dining',
    description: 'Your order will arrive today',
    progressPercentage: 80,
  },
  delivered: {
    label: 'Delivered',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: 'check_circle',
    description: 'Your order has been delivered',
    progressPercentage: 100,
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: 'cancel',
    description: 'Your order has been cancelled',
    progressPercentage: 0,
  },
};

// Get status color classes
export const getStatusColor = (status: OrderStatus): string => {
  return statusConfig[status]?.color || statusConfig.processing.color;
};

// Get status icon name
export const getStatusIcon = (status: OrderStatus): string => {
  return statusConfig[status]?.icon || statusConfig.processing.icon;
};

// Get human-readable status label
export const getStatusLabel = (status: OrderStatus): string => {
  return statusConfig[status]?.label || statusConfig.processing.label;
};

// Get status description
export const getStatusDescription = (status: OrderStatus): string => {
  return statusConfig[status]?.description || statusConfig.processing.description;
};

// Calculate progress percentage for progress bar
export const calculateProgress = (status: OrderStatus): number => {
  return statusConfig[status]?.progressPercentage || 0;
};

// Check if status is considered "active" (not cancelled or delivered)
export const isActiveStatus = (status: OrderStatus): boolean => {
  return status !== 'cancelled' && status !== 'delivered';
};

// Check if status is considered "completed" (delivered)
export const isCompletedStatus = (status: OrderStatus): boolean => {
  return status === 'delivered';
};

// Check if status is considered "failed" (cancelled)
export const isFailedStatus = (status: OrderStatus): boolean => {
  return status === 'cancelled';
};

// Get next status in the flow
export const getNextStatus = (status: OrderStatus): OrderStatus | null => {
  const statusFlow: OrderStatus[] = ['processing', 'shipped', 'out_for_delivery', 'delivered'];

  const currentIndex = statusFlow.indexOf(status);
  if (currentIndex === -1 || currentIndex === statusFlow.length - 1) {
    return null;
  }

  return statusFlow[currentIndex + 1];
};

// Get previous status in the flow
export const getPreviousStatus = (status: OrderStatus): OrderStatus | null => {
  const statusFlow: OrderStatus[] = ['processing', 'shipped', 'out_for_delivery', 'delivered'];

  const currentIndex = statusFlow.indexOf(status);
  if (currentIndex <= 0) {
    return null;
  }

  return statusFlow[currentIndex - 1];
};

// Get all possible statuses
export const getAllStatuses = (): OrderStatus[] => {
  return Object.keys(statusConfig) as OrderStatus[];
};

// Get status configuration object
export const getStatusConfig = (status: OrderStatus): StatusConfig => {
  return statusConfig[status] || statusConfig.processing;
};

// Format estimated delivery date
export const formatEstimatedDelivery = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return 'Delivered';
  } else if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Tomorrow';
  } else if (diffDays <= 7) {
    return `In ${diffDays} days`;
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
};

// Get tracking status based on current status and events
export const getTrackingStatus = (
  status: OrderStatus,
  events: Array<{ timestamp: string; status: string }>
): OrderStatus => {
  // If we have recent events, use the latest event status
  if (events && events.length > 0) {
    const latestEvent = events[0];
    const eventStatus = latestEvent.status.toLowerCase().replace(' ', '_') as OrderStatus;

    // Validate that it's a known status
    if (statusConfig[eventStatus]) {
      return eventStatus;
    }
  }

  return status;
};

// Generate status steps for progress tracking
export const getStatusSteps = (
  currentStatus: OrderStatus
): Array<{
  id: number;
  label: string;
  icon: string;
  completed: boolean;
  active: boolean;
}> => {
  const steps = [
    { id: 0, label: 'Order Placed', icon: 'shopping_cart', status: 'processing' as OrderStatus },
    { id: 1, label: 'Processing', icon: 'pending', status: 'processing' as OrderStatus },
    { id: 2, label: 'Shipped', icon: 'local_shipping', status: 'shipped' as OrderStatus },
    {
      id: 3,
      label: 'Out for Delivery',
      icon: 'delivery_dining',
      status: 'out_for_delivery' as OrderStatus,
    },
    { id: 4, label: 'Delivered', icon: 'check_circle', status: 'delivered' as OrderStatus },
  ];

  const currentStepIndex = steps.findIndex((step) => step.status === currentStatus);

  return steps.map((step, index) => ({
    ...step,
    completed:
      index < currentStepIndex || (index === currentStepIndex && currentStatus === 'delivered'),
    active: index === currentStepIndex && currentStatus !== 'delivered',
  }));
};
