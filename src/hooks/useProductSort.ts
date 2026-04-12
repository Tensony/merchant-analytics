import { useState, useMemo } from 'react';
import type { Product } from '../types';

type SortKey = 'revenue' | 'sales' | 'delta';
type SortDir = 'asc' | 'desc';

interface UseProductSortReturn {
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
      setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      const mult = sortDir === 'desc' ? -1 : 1;
      return (a[sortKey] - b[sortKey]) * mult;
    });
  }, [products, sortKey, sortDir]);

  return { sortKey, sortDir, sortedProducts, toggleSort };
}