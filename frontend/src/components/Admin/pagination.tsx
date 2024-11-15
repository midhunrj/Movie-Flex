import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const generatePageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];

    // Show the first page if the current page is greater than 5
    if (currentPage > 5) {
      pages.push(1);
      pages.push('...');
    }

    // Show 3 pages close to the current page
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(currentPage + 2, totalPages); i++) {
      pages.push(i);
    }

    // Show the last page if the current page is not too close to the end
    if (currentPage < totalPages - 2) {
      pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number') {
      onPageChange(page);
    }
  };

  return (
    <div className="flex justify-center items-center mt-4">
      <button
        className="px-2 py-1 border rounded mx-1"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </button>
      {generatePageNumbers().map((page, index) => (
        <button
          key={index}
          className={`px-2 py-1 border rounded mx-1 ${
            page === currentPage ? 'bg-blue-500 text-white' : ''
          }`}
          disabled={page === currentPage || page === '...'}
          onClick={() => handlePageClick(page)}
        >
          {page}
        </button>
      ))}
      <button
        className="px-2 py-1 border rounded mx-1"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
