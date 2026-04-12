import { useState, useMemo } from 'react';
import type { Order, OrderStatus } from '../types';

type FilterStatus = OrderStatus | 'all';

interface UseOrderFilterReturn {
  search: string;
  statusFilter: FilterStatus;
  filteredOrders: Order[];
  setSearch: (s: string) => void;
  setStatusFilter: (s: FilterStatus) => void;
}

export function useOrderFilter(orders: Order[]): UseOrderFilterReturn {
  const [search, setSearch]             = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        search === '' ||
        o.customer.toLowerCase().includes(search.toLowerCase()) ||
        o.id.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || o.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  return { search, statusFilter, filteredOrders, setSearch, setStatusFilter };
}