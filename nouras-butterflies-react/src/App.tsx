import { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AdminProvider } from '@/contexts/AdminContext';
import { ProtectedAdminRoute } from '@/components/admin/ProtectedAdminRoute';
import { ModalsProvider } from '@/contexts/ModalsContext';
import { GlobalModals } from '@/components/modals/GlobalModals';
import { createLazyComponent } from '@/utils/routePreloader';
import { trackPageView } from '@/utils/analytics';

// Create preloadable components for route preloading and lazy loading
const PreloadableHomePage = createLazyComponent(() => import('@/pages/HomePage'), 'home');
const PreloadableProductCatalogDemo = createLazyComponent(
  () => import('@/pages/ProductCatalogDemo'),
  'products'
);
const PreloadableProductCatalogPage = createLazyComponent(
  () => import('@/pages/ProductCatalogPage'),
  'products'
);
const PreloadableProductDetailsPage = createLazyComponent(
  () => import('@/pages/ProductDetailsPage'),
  'products'
);
const PreloadableCartPage = createLazyComponent(() => import('@/pages/CartPage'), 'cart');
const PreloadableCheckoutPage = createLazyComponent(
  () => import('@/pages/CheckoutPage'),
  'checkout'
);
const PreloadableOrderConfirmationPage = createLazyComponent(
  () => import('@/pages/OrderConfirmationPage'),
  'orders'
);
const PreloadableLoginPage = createLazyComponent(
  () => import('@/pages/LoginPage').then((module) => ({ default: module.LoginPage })),
  'login'
);
const PreloadableAccountDashboardPage = createLazyComponent(
  () =>
    import('@/pages/AccountDashboardPage').then((module) => ({
      default: module.AccountDashboardPage,
    })),
  'account'
);
const PreloadableWishlistPage = createLazyComponent(
  () => import('@/pages/WishlistPage').then((module) => ({ default: module.WishlistPage })),
  'wishlist'
);
const PreloadableComparisonPage = createLazyComponent(
  () => import('@/pages/ComparisonPage').then((module) => ({ default: module.ComparisonPage })),
  'comparison'
);
const PreloadableOrderTrackingPage = createLazyComponent(
  () =>
    import('@/pages/OrderTrackingPage').then((module) => ({ default: module.OrderTrackingPage })),
  'orders'
);
const PreloadableProfileSettingsPage = createLazyComponent(
  () =>
    import('@/pages/ProfileSettingsPage').then((module) => ({
      default: module.ProfileSettingsPage,
    })),
  'account'
);
const PreloadableAboutPage = createLazyComponent(() => import('@/pages/AboutPage'), 'about');
const PreloadableBlogPage = createLazyComponent(() => import('@/pages/BlogPage'), 'blog');
const PreloadableFAQPage = createLazyComponent(() => import('@/pages/FAQPage'), 'faq');
const PreloadableContactPage = createLazyComponent(() => import('@/pages/ContactPage'), 'contact');
const PreloadableNotFoundPage = createLazyComponent(() => import('@/pages/NotFoundPage'), '404');
const PreloadableRewardsPage = createLazyComponent(() => import('@/pages/RewardsPage'), 'rewards');
const PreloadableAdminSettingsPage = createLazyComponent(
  () => import('@/pages/admin/AdminSettingsPage'),
  'admin'
);

// Skeleton loaders for different page types
const HomeSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-64 bg-gray-200 rounded-lg mb-4" />
    <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-48 bg-gray-200 rounded-lg" />
      ))}
    </div>
  </div>
);

const ProductSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-12 bg-gray-200 rounded w-1/2 mb-6" />
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div key={i} className="h-80 bg-gray-200 rounded-lg" />
      ))}
    </div>
  </div>
);

const DefaultSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
    <div className="h-4 bg-gray-200 rounded w-full mb-2" />
    <div className="h-4 bg-gray-200 rounded w-5/6 mb-2" />
    <div className="h-4 bg-gray-200 rounded w-4/6" />
  </div>
);

// Preload common routes on app start
if (typeof window !== 'undefined') {
  setTimeout(() => {
    PreloadableHomePage.preload();
    PreloadableProductCatalogPage.preload();
  }, 2000);
}

function App() {
  // Initialize GTM
  useEffect(() => {
    if (import.meta.env['VITE_GTM_ID']) {
      // Initialize GTM dataLayer
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js',
      });
      
      // Load GTM script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtm.js?id=${import.meta.env['VITE_GTM_ID']}`;
      document.head.appendChild(script);
      
      console.log('[App] GTM initialized with ID:', import.meta.env['VITE_GTM_ID']);
    } else {
      console.log('[App] GTM ID not found, skipping initialization');
    }
  }, []);

  // Track page views
  useEffect(() => {
    const handleRouteChange = () => {
      const path = window.location.pathname;
      const title = document.title;
      
      // Track in analytics
      trackPageView(path, title, {
        referrer: document.referrer,
        userAgent: navigator.userAgent,
      });
      
      // Push to GTM dataLayer
      if ((window as any).dataLayer) {
        (window as any).dataLayer.push({
          event: 'page_view',
          page_path: path,
          page_title: title,
          page_location: window.location.href,
          page_referrer: document.referrer,
        });
      }
    };

    // Track initial page load
    handleRouteChange();
    
    // Listen for route changes
    const unlisten = () => {
      // This would be set up with router navigation events
      // For now, we'll track on component mount
    };
    
    return unlisten;
  }, []);

  return (
    <AdminProvider>
      <ModalsProvider>
        <Router>
          <Layout>
            <Routes>
              {/* Public Routes with specific Suspense boundaries */}
              <Route
                path="/"
                element={
                  <Suspense fallback={<HomeSkeleton />}>
                    <PreloadableHomePage.LazyComponent />
                  </Suspense>
                }
              />
              <Route
                path="/home"
                element={
                  <Suspense fallback={<HomeSkeleton />}>
                    <PreloadableHomePage.LazyComponent />
                  </Suspense>
                }
              />
              <Route
                path="/catalog-demo"
                element={
                  <Suspense fallback={<DefaultSkeleton />}>
                    <PreloadableProductCatalogDemo.LazyComponent />
                  </Suspense>
                }
              />
              <Route
                path="/products"
                element={
                  <Suspense fallback={<ProductSkeleton />}>
                    <PreloadableProductCatalogPage.LazyComponent />
                  </Suspense>
                }
              />
              <Route
                path="/products/:category"
                element={
                  <Suspense fallback={<ProductSkeleton />}>
                    <PreloadableProductCatalogPage.LazyComponent />
                  </Suspense>
                }
              />
              <Route
                path="/product/:id"
                element={
                  <Suspense fallback={<DefaultSkeleton />}>
                    <PreloadableProductDetailsPage.LazyComponent />
                  </Suspense>
                }
              />
              <Route
                path="/cart"
                element={
                  <Suspense fallback={<DefaultSkeleton />}>
                    <PreloadableCartPage.LazyComponent />
                  </Suspense>
                }
              />
              <Route
                path="/checkout"
                element={
                  <Suspense fallback={<DefaultSkeleton />}>
                    <PreloadableCheckoutPage.LazyComponent />
                  </Suspense>
                }
              />
              <Route
                path="/order-confirmation"
                element={
                  <Suspense fallback={<DefaultSkeleton />}>
                    <PreloadableOrderConfirmationPage.LazyComponent />
                  </Suspense>
                }
              />
              <Route
                path="/about"
                element={
                  <Suspense fallback={<DefaultSkeleton />}>
                    <PreloadableAboutPage.LazyComponent />
                  </Suspense>
                }
              />
              <Route
                path="/blog"
                element={
                  <Suspense fallback={<DefaultSkeleton />}>
                    <PreloadableBlogPage.LazyComponent />
                  </Suspense>
                }
              />
              <Route
                path="/faq"
                element={
                  <Suspense fallback={<DefaultSkeleton />}>
                    <PreloadableFAQPage.LazyComponent />
                  </Suspense>
                }
              />
              <Route
                path="/contact"
                element={
                  <Suspense fallback={<DefaultSkeleton />}>
                    <PreloadableContactPage.LazyComponent />
                  </Suspense>
                }
              />
              <Route
                path="/rewards"
                element={
                  <Suspense fallback={<DefaultSkeleton />}>
                    <PreloadableRewardsPage.LazyComponent />
                  </Suspense>
                }
              />
              <Route
                path="/track-order"
                element={
                  <Suspense fallback={<DefaultSkeleton />}>
                    <PreloadableOrderTrackingPage.LazyComponent />
                  </Suspense>
                }
              />

              {/* Authentication Routes */}
              <Route
                path="/login"
                element={
                  <Suspense fallback={<DefaultSkeleton />}>
                    <PreloadableLoginPage.LazyComponent />
                  </Suspense>
                }
              />

              {/* Protected Routes */}
              <Route
                path="/account"
                element={
                  <Suspense fallback={<DefaultSkeleton />}>
                    <ProtectedRoute>
                      <PreloadableAccountDashboardPage.LazyComponent />
                    </ProtectedRoute>
                  </Suspense>
                }
              />
              <Route
                path="/wishlist"
                element={
                  <Suspense fallback={<DefaultSkeleton />}>
                    <ProtectedRoute>
                      <PreloadableWishlistPage.LazyComponent />
                    </ProtectedRoute>
                  </Suspense>
                }
              />
              <Route
                path="/compare"
                element={
                  <Suspense fallback={<DefaultSkeleton />}>
                    <ProtectedRoute>
                      <PreloadableComparisonPage.LazyComponent />
                    </ProtectedRoute>
                  </Suspense>
                }
              />
              <Route
                path="/profile"
                element={
                  <Suspense fallback={<DefaultSkeleton />}>
                    <ProtectedRoute>
                      <PreloadableProfileSettingsPage.LazyComponent />
                    </ProtectedRoute>
                  </Suspense>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <Suspense fallback={<DefaultSkeleton />}>
                    <ProtectedAdminRoute>
                      <PreloadableAdminSettingsPage.LazyComponent />
                    </ProtectedAdminRoute>
                  </Suspense>
                }
              />

              {/* 404 Page */}
              <Route
                path="*"
                element={
                  <Suspense fallback={<DefaultSkeleton />}>
                    <PreloadableNotFoundPage.LazyComponent />
                  </Suspense>
                }
              />
            </Routes>
            <GlobalModals />
          </Layout>
        </Router>
      </ModalsProvider>
    </AdminProvider>
  );
}

export default App;
