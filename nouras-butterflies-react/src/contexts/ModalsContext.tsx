import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Product } from '../types/product';

export interface ModalsState {
  searchOpen: boolean;
  firstOrderPopupOpen: boolean;
  offersDrawerOpen: boolean;
  newsletterPopupOpen: boolean;
  reviewFormModalOpen: boolean;
  productReviewModalOpen: boolean;
  feedbackFormModalOpen: boolean;
  productForReview: Product | null;
}

export interface ModalsActions {
  openSearch: () => void;
  closeSearch: () => void;
  openFirstOrderPopup: () => void;
  closeFirstOrderPopup: () => void;
  openOffersDrawer: () => void;
  closeOffersDrawer: () => void;
  openNewsletterPopup: () => void;
  closeNewsletterPopup: () => void;
  openReviewFormModal: () => void;
  closeReviewFormModal: () => void;
  openProductReviewModal: (product: Product) => void;
  closeProductReviewModal: () => void;
  openFeedbackFormModal: () => void;
  closeFeedbackFormModal: () => void;
  closeAllModals: () => void;
}

export type ModalsContextValue = ModalsState & ModalsActions;

const initialState: ModalsState = {
  searchOpen: false,
  firstOrderPopupOpen: false,
  offersDrawerOpen: false,
  newsletterPopupOpen: false,
  reviewFormModalOpen: false,
  productReviewModalOpen: false,
  feedbackFormModalOpen: false,
  productForReview: null,
};

const ModalsContext = createContext<ModalsContextValue | undefined>(undefined);

export interface ModalsProviderProps {
  children: React.ReactNode;
}

export const ModalsProvider: React.FC<ModalsProviderProps> = ({ children }) => {
  console.log('[Context] Initializing ModalsProvider...');
  const [state, setState] = useState<ModalsState>(initialState);

  const updateModalState = useCallback(<K extends keyof ModalsState>(modal: K, isOpen: boolean) => {
    console.log('[Modals] Updating modal state:', modal, isOpen ? 'opening' : 'closing');

    setState((prevState) => {
      if (!prevState) {
        console.warn('[Modals] Previous state is null, using initial state');
        prevState = initialState;
      }

      // Prevent multiple modals from being open simultaneously
      if (isOpen) {
        // Close all other modals when opening a new one
        const newState = { ...prevState };
        Object.keys(newState).forEach((key) => {
          if (key !== 'productForReview') {
            (newState as any)[key] = false;
          }
        });
        newState[modal] = true as ModalsState[K];
        console.log('[Modals] Opened modal:', modal, 'and closed others');
        return newState;
      } else {
        console.log('[Modals] Closed modal:', modal);
        return {
          ...prevState,
          [modal]: false,
        };
      }
    });
  }, []);

  const setProductForReview = useCallback((product: Product | null) => {
    if (!product) {
      console.log('[Modals] Clearing product for review');
    } else {
      console.log('[Modals] Setting product for review:', product.id, product.name);
    }

    setState((prevState) => {
      if (!prevState) {
        console.warn('[Modals] Previous state is null in setProductForReview');
        return { ...initialState, productForReview: product };
      }
      return {
        ...prevState,
        productForReview: product,
      };
    });
  }, []);

  const closeAllModals = useCallback(() => {
    console.log('[Modals] Closing all modals');
    setState(initialState);
  }, []);

  const actions: ModalsActions = {
    openSearch: () => {
      console.log('[Modals] Opening search modal');
      updateModalState('searchOpen', true);
    },
    closeSearch: () => {
      console.log('[Modals] Closing search modal');
      updateModalState('searchOpen', false);
    },
    openFirstOrderPopup: () => {
      console.log('[Modals] Opening first order popup');
      updateModalState('firstOrderPopupOpen', true);
    },
    closeFirstOrderPopup: () => {
      console.log('[Modals] Closing first order popup');
      updateModalState('firstOrderPopupOpen', false);
    },
    openOffersDrawer: () => {
      console.log('[Modals] Opening offers drawer');
      updateModalState('offersDrawerOpen', true);
    },
    closeOffersDrawer: () => {
      console.log('[Modals] Closing offers drawer');
      updateModalState('offersDrawerOpen', false);
    },
    openNewsletterPopup: () => {
      console.log('[Modals] Opening newsletter popup');
      updateModalState('newsletterPopupOpen', true);
    },
    closeNewsletterPopup: () => {
      console.log('[Modals] Closing newsletter popup');
      updateModalState('newsletterPopupOpen', false);
    },
    openReviewFormModal: () => {
      console.log('[Modals] Opening review form modal');
      updateModalState('reviewFormModalOpen', true);
    },
    closeReviewFormModal: () => {
      console.log('[Modals] Closing review form modal');
      updateModalState('reviewFormModalOpen', false);
    },
    openProductReviewModal: (product: Product) => {
      if (!product || !product.id) {
        console.error('[Modals] Invalid product provided for review modal');
        return;
      }
      console.log('[Modals] Opening product review modal for:', product.id);
      setProductForReview(product);
      updateModalState('productReviewModalOpen', true);
    },
    closeProductReviewModal: () => {
      console.log('[Modals] Closing product review modal');
      setProductForReview(null);
      updateModalState('productReviewModalOpen', false);
    },
    openFeedbackFormModal: () => {
      console.log('[Modals] Opening feedback form modal');
      updateModalState('feedbackFormModalOpen', true);
    },
    closeFeedbackFormModal: () => {
      console.log('[Modals] Closing feedback form modal');
      updateModalState('feedbackFormModalOpen', false);
    },
    closeAllModals,
  };

  const value: ModalsContextValue = {
    ...state,
    ...actions,
  };

  return <ModalsContext.Provider value={value}>{children}</ModalsContext.Provider>;
};

export const useModals = (): ModalsContextValue => {
  const context = useContext(ModalsContext);
  if (context === undefined) {
    console.error('[Modals] useModals hook called outside ModalsProvider');
    throw new Error('useModals must be used within a ModalsProvider');
  }
  if (!context) {
    console.error('[Modals] ModalsContext is null or undefined');
    throw new Error('ModalsContext is not properly initialized');
  }
  return context;
};
