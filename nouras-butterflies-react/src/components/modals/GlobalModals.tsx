import React from 'react';
import { useModals } from '@/contexts/ModalsContext';
import {
  SearchModal,
  FirstOrderPopup,
  OffersDrawer,
  NewsletterPopup,
  ReviewFormModal,
  ProductReviewModal,
  FeedbackFormModal,
} from './index';

export const GlobalModals: React.FC = () => {
  const {
    searchOpen,
    closeSearch,
    firstOrderPopupOpen,
    closeFirstOrderPopup,
    offersDrawerOpen,
    closeOffersDrawer,
    newsletterPopupOpen,
    closeNewsletterPopup,
    reviewFormModalOpen,
    closeReviewFormModal,
    productReviewModalOpen,
    closeProductReviewModal,
    feedbackFormModalOpen,
    closeFeedbackFormModal,
    productForReview,
  } = useModals();

  return (
    <>
      {/* Search Modal */}
      <SearchModal open={searchOpen} onClose={closeSearch} />

      {/* First Order Popup */}
      <FirstOrderPopup open={firstOrderPopupOpen} onClose={closeFirstOrderPopup} />

      {/* Offers Drawer */}
      <OffersDrawer open={offersDrawerOpen} onClose={closeOffersDrawer} />

      {/* Newsletter Popup */}
      <NewsletterPopup open={newsletterPopupOpen} onClose={closeNewsletterPopup} />

      {/* Review Form Modals */}
      <ReviewFormModal open={reviewFormModalOpen} onClose={closeReviewFormModal} />
      <ProductReviewModal
        open={productReviewModalOpen}
        onClose={closeProductReviewModal}
        product={productForReview || undefined}
      />
      <FeedbackFormModal open={feedbackFormModalOpen} onClose={closeFeedbackFormModal} />
    </>
  );
};

GlobalModals.displayName = 'GlobalModals';
