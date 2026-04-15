import { useState, useEffect, useRef, useCallback } from 'react';

export interface LiveOrder {
  id:       string;
  customer: string;
  product:  string;
  amount:   number;
  status:   'completed' | 'pending' | 'refunded';
  date:     string;
  ts:       string;
}

interface UseRealtimeOrdersReturn {
  orders:      LiveOrder[];
  connected:   boolean;
  orderCount:  number;
  clearOrders: () => void;
}

const WS_URL     = 'ws://localhost:8000/ws/orders';
const MAX_ORDERS = 20;

export function useRealtimeOrders(): UseRealtimeOrdersReturn {
  const [orders, setOrders] = useState<LiveOrder[]>([]);
  const [connected, setConnected] = useState<boolean>(false);
  const [orderCount, setOrderCount] = useState<number>(0);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => setConnected(true);

      ws.onmessage = (event) => {
        const order = JSON.parse(event.data) as LiveOrder;
        setOrders((prev) => [order, ...prev].slice(0, MAX_ORDERS));
        setOrderCount((n) => n + 1);
      };

      ws.onclose = () => {
        setConnected(false);
        reconnectTimer.current = setTimeout(connect, 3000);
      };

      ws.onerror = () => {
        ws.close();
      };
    } catch {
      reconnectTimer.current = setTimeout(connect, 3000);
    }
  }, []);

  useEffect(() => {
    connect();
    return () => {
      clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
    };
  }, [connect]);

  const clearOrders = useCallback(() => setOrders([]), []);

  return { orders, connected, orderCount, clearOrders };
}