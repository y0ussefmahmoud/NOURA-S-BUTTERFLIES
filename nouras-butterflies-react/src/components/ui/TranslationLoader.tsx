import React, { useEffect, useState } from 'react';
import i18n from 'i18next';
import { isI18nReady } from '@/config/i18n.config';

interface TranslationLoaderProps {
  children: React.ReactNode;
  timeoutMs?: number;
}

export const TranslationLoader: React.FC<TranslationLoaderProps> = ({
  children,
  timeoutMs = 5000,
}) => {
  const [isReady, setIsReady] = useState(i18n.isInitialized);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const timeoutId = window.setTimeout(() => {
      if (isMounted) {
        setHasTimedOut(true);
      }
    }, timeoutMs);

    if (!i18n.isInitialized) {
      isI18nReady
        .then(() => {
          if (isMounted) {
            setIsReady(true);
          }
        })
        .catch((error) => {
          console.error('[i18n] Translation loader failed:', error);
          if (isMounted) {
            setHasError(true);
          }
        });
    } else {
      setIsReady(true);
    }

    return () => {
      isMounted = false;
      window.clearTimeout(timeoutId);
    };
  }, [timeoutMs]);

  if (isReady) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background-light dark:bg-background-dark">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <div className="text-center">
        <p className="text-sm font-medium text-foreground-light dark:text-foreground-dark">
          Loading translations...
        </p>
        {hasTimedOut && (
          <div className="mt-4 space-y-2 text-sm text-foreground-light/70 dark:text-foreground-dark/70">
            <p>Translations are taking longer than expected.</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white"
            >
              Retry
            </button>
          </div>
        )}
        {hasError && (
          <div className="mt-4 space-y-2 text-sm text-red-600 dark:text-red-400">
            <p>Failed to load translations.</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
