import toast, { Toaster } from 'react-hot-toast';

export function AnomalyToast() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: '#1e222b',
          border: '1px solid #f5a623',
          color: '#f5a623',
          fontFamily: 'DM Mono, monospace',
          fontSize: '12px',
          borderRadius: '10px',
          padding: '12px 16px',
        },
        duration: 5000,
      }}
    />
  );
}

export function triggerAnomalyToast(message: string) {
  toast(`⚠ ${message}`, { icon: undefined });
}