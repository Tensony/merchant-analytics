// Utility functions 
export const formatCurrency = (v: number): string =>
  '$' + v.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

export const formatCompact = (v: number): string => {
  if (v >= 1_000_000) return '$' + (v / 1_000_000).toFixed(1) + 'M';
  if (v >= 1_000) return '$' + (v / 1_000).toFixed(1) + 'k';
  return '$' + v;
};

export const formatNumber = (v: number): string =>
  v.toLocaleString('en-US');

export const formatPct = (v: number): string =>
  v.toFixed(1) + '%';

export const formatAOV = (v: number): string =>
  '$' + v.toFixed(2);