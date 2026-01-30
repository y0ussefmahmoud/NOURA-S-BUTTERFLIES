import React, { useState, useCallback, useMemo } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import type { GridChildComponentProps } from 'react-window';
import { ProductCard } from './ProductCard';
import { EditorialCard } from './EditorialCard';
import type { Product } from '../../types/product';
import type { ReactNode } from 'react';

interface ProductGridProps {
  products: Product[];
  columns?: { mobile?: 1 | 2; tablet?: 2 | 3; desktop?: 3 | 4 };
  gap?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  emptyMessage?: string;
  renderCard?: (product: Product) => ReactNode;
  onAddToCart?: (productId: string) => void;
  onQuickView?: (productId: string) => void;
  onToggleFavorite?: (productId: string) => void;
  editorialCardIndex?: number;
  editorialCardProps?: {
    title: string;
    quote?: string;
    ctaText: string;
    ctaHref: string;
    icon?: string;
  };
  // Virtual scrolling props
  enableVirtualization?: boolean;
  containerHeight?: number;
  itemHeight?: number;
  overscan?: number;
}

const gridColumns = {
  mobile: {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
  },
  tablet: {
    2: 'tablet:grid-cols-2',
    3: 'tablet:grid-cols-3',
  },
  desktop: {
    3: 'lg:grid-cols-3',
    4: 'xl:grid-cols-4',
  },
};

const gapClasses = {
  sm: 'gap-x-4 gap-y-6',
  md: 'gap-x-6 gap-y-8',
  lg: 'gap-x-8 gap-y-12',
};

const SkeletonCard: React.FC = React.memo(() => (
  <div className="animate-pulse">
    <div className="bg-gray-200 rounded-2xl aspect-[4/5] mb-4" />
    <div className="h-4 bg-gray-200 rounded mb-2" />
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
    <div className="h-6 bg-gray-200 rounded w-1/2" />
  </div>
));

SkeletonCard.displayName = 'SkeletonCard';

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'lg',
  loading = false,
  emptyMessage = 'No products found',
  renderCard,
  onAddToCart,
  onQuickView,
  onToggleFavorite,
  editorialCardIndex,
  editorialCardProps,
  enableVirtualization = false,
  containerHeight = 600,
  itemHeight = 400,
  overscan = 5,
}) => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Calculate responsive columns
  const getColumnsCount = useCallback(() => {
    if (typeof window === 'undefined') return columns.desktop || 3;
    if (window.innerWidth < 640) return columns.mobile || 1; // sm breakpoint
    if (window.innerWidth < 900) return columns.tablet || 2; // tablet breakpoint
    return columns.desktop || 3;
  }, [columns]);

  const columnsCount = getColumnsCount();

  // Safe window dimensions with fallbacks
  const windowDimensions = useMemo(() => {
    if (typeof window === 'undefined') {
      return { width: 1200, height: 800 };
    }
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }, []);

  const gridClassName = useMemo(() => {
    return `grid ${gridColumns.mobile[columns.mobile || 1]} ${gridColumns.tablet[columns.tablet || 2]} ${gridColumns.desktop[columns.desktop || 3]} ${gapClasses[gap]}`;
  }, [columns.desktop, columns.mobile, columns.tablet, gap]);

  // Calculate grid dimensions
  const rowCount = Math.ceil(products.length / columnsCount);
  const gapSize = gap === 'sm' ? 16 : gap === 'md' ? 24 : 32;

  const handleToggleFavorite = useCallback(
    (productId: string) => {
      setFavorites((prev) => {
        const newFavorites = new Set(prev);
        if (newFavorites.has(productId)) {
          newFavorites.delete(productId);
        } else {
          newFavorites.add(productId);
        }
        return newFavorites;
      });
      onToggleFavorite?.(productId);
    },
    [onToggleFavorite]
  );

  // Memoized item renderer for virtual grid
  const VirtualItem = useCallback(
    ({ columnIndex, rowIndex, style }: GridChildComponentProps) => {
      const itemIndex = rowIndex * columnsCount + columnIndex;
      const product = products[itemIndex];

      if (!product || itemIndex >= products.length) {
        return <div style={style} />;
      }

      return (
        <div style={style} className="p-2">
          {renderCard ? (
            renderCard(product)
          ) : (
            <ProductCard
              product={product}
              onAddToCart={onAddToCart}
              onQuickView={onQuickView}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={favorites.has(product.id)}
            />
          )}
        </div>
      );
    },
    [columnsCount, favorites, handleToggleFavorite, onAddToCart, onQuickView, products, renderCard]
  );

  // Render virtual grid
  if (enableVirtualization && products.length > 0) {
    return (
      <div className="w-full">
        <Grid
          columnCount={columnsCount}
          columnWidth={Math.floor(
            (windowDimensions.width - (columnsCount - 1) * gapSize - 48) / columnsCount
          )} // 48px for container padding
          height={containerHeight}
          width={windowDimensions.width - 48} // Full width minus container padding
          rowCount={rowCount}
          rowHeight={itemHeight}
          overscanCount={overscan}
          itemData={products}
        >
          {VirtualItem}
        </Grid>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={gridClassName}>
        {Array.from({ length: 8 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <span className="material-symbols-rounded text-6xl text-gray-300 mb-4 block">
          shopping_bag
        </span>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{emptyMessage}</h3>
        <p className="text-gray-600 mb-6">
          Try adjusting your filters or browse our featured products
        </p>
        <button className="bg-primary text-white px-6 py-3 rounded-full hover:bg-primary/90 transition-colors">
          Browse All Products
        </button>
      </div>
    );
  }

  // Render regular grid (non-virtual)
  const renderProductCard = useCallback(
    (product: Product) => {
      if (renderCard) {
        return (
          <div key={product.id} className="transition-all duration-700 opacity-100 translate-y-0">
            {renderCard(product)}
          </div>
        );
      }

      return (
        <div key={product.id} className="transition-all duration-700 opacity-100 translate-y-0">
          <ProductCard
            product={product}
            onAddToCart={onAddToCart}
            onQuickView={onQuickView}
            onToggleFavorite={handleToggleFavorite}
            isFavorite={favorites.has(product.id)}
          />
        </div>
      );
    },
    [favorites, handleToggleFavorite, onAddToCart, onQuickView, renderCard]
  );

  const renderEditorialCard = useCallback(() => {
    if (!editorialCardProps) return null;

    return (
      <div className="transition-all duration-700 opacity-100 scale-100">
        <EditorialCard {...editorialCardProps} />
      </div>
    );
  }, [editorialCardProps]);

  const gridItems = useMemo(() => {
    return products.map((product, index) => {
      if (editorialCardIndex && index === editorialCardIndex) {
        return (
          <React.Fragment key={`editorial-${index}`}>
            {renderEditorialCard()}
            {renderProductCard(product)}
          </React.Fragment>
        );
      }

      return renderProductCard(product);
    });
  }, [editorialCardIndex, products, renderEditorialCard, renderProductCard]);

  return <div className={gridClassName}>{gridItems}</div>;
};
