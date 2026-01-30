import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisible?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisible = 5,
}) => {
  const getVisiblePages = () => {
    const pages: number[] = [];
    const start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-12">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`size-10 rounded-full flex items-center justify-center transition-all ${
          currentPage === 1
            ? 'opacity-40 cursor-not-allowed'
            : 'border border-[#eacdd2] hover:bg-white dark:hover:bg-black/20'
        }`}
      >
        <span className="material-symbols-rounded text-sm">chevron_left</span>
      </button>

      {/* Page Numbers */}
      {visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`size-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
            currentPage === page
              ? 'bg-primary text-white font-bold'
              : 'hover:bg-white dark:hover:bg-black/20'
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`size-10 rounded-full flex items-center justify-center transition-all ${
          currentPage === totalPages
            ? 'opacity-40 cursor-not-allowed'
            : 'border border-[#eacdd2] hover:bg-white dark:hover:bg-black/20'
        }`}
      >
        <span className="material-symbols-rounded text-sm">chevron_right</span>
      </button>
    </div>
  );
};
