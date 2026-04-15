import { useState, useMemo } from 'react';

interface UsePaginationReturn<T> {
  currentPage:   number;
  totalPages:    number;
  paginatedItems: T[];
  setPage:       (page: number) => void;
  resetPage:     () => void;
}

export function usePagination<T>(
  items: T[],
  itemsPerPage: number
): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));

  // Reset to page 1 if items change and current page is out of range
  const safePage = Math.min(currentPage, totalPages);

  const paginatedItems = useMemo(() => {
    const start = (safePage - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }, [items, safePage, itemsPerPage]);

  function setPage(page: number) {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }

  function resetPage() {
    setCurrentPage(1);
  }

  return {
    currentPage: safePage,
    totalPages,
    paginatedItems,
    setPage,
    resetPage,
  };
}