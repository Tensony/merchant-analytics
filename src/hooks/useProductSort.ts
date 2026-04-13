import { useState, useMemo } from 'react';
import type { Product } from '../types';

type SortKey = 'revenue' | 'sales' | 'delta';
type SortDir = 'asc' | 'desc';

export interface UseProductSortReturn {
  sortKey: SortKey;
  sortDir: SortDir;
  sortedProducts: Product[];
  toggleSort: (key: SortKey) => void;
}

export function useProductSort(products: Product[]): UseProductSortReturn {
  const [sortKey, setSortKey] = useState<SortKey>('revenue');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((prev) => (prev === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      const multiplier = sortDir === 'desc' ? -1 : 1;
      return (a[sortKey] - b[sortKey]) * multiplier;
    });
  }, [products, sortKey, sortDir]);

  return {
    sortKey,
    sortDir,
    sortedProducts,
    toggleSort,
  };
}