import { clsx } from 'clsx';

interface PaginationProps {
  currentPage:  number;
  totalPages:   number;
  totalItems:   number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const start = (currentPage - 1) * itemsPerPage + 1;
  const end   = Math.min(currentPage * itemsPerPage, totalItems);

  // Build page number array with ellipsis
  function getPages(): (number | '...')[] {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }
    if (currentPage >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  }

  return (
    <div
      className="flex items-center justify-between px-[18px] py-3"
      style={{ borderTop: '1px solid var(--border)' }}
    >
      {/* Count info */}
      <span
        className="font-mono text-[11px]"
        style={{ color: 'var(--text3)' }}
      >
        {start}–{end} of {totalItems.toLocaleString()}
      </span>

      {/* Page buttons */}
      <div className="flex items-center gap-1">
        {/* Prev */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-7 h-7 flex items-center justify-center rounded-md font-mono text-xs transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            border: '1px solid var(--border)',
            color: 'var(--text2)',
          }}
          onMouseEnter={(e) => {
            if (currentPage !== 1)
              e.currentTarget.style.backgroundColor = 'var(--surface2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          ←
        </button>

        {/* Page numbers */}
        {getPages().map((page, i) =>
          page === '...' ? (
            <span
              key={`ellipsis-${i}`}
              className="w-7 h-7 flex items-center justify-center font-mono text-xs"
              style={{ color: 'var(--text3)' }}
            >
              ···
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className="w-7 h-7 flex items-center justify-center rounded-md font-mono text-xs transition-all"
              style={{
                backgroundColor: currentPage === page ? '#22d98a' : 'transparent',
                color:           currentPage === page ? '#0d0f12' : 'var(--text2)',
                border:          currentPage === page
                  ? 'none'
                  : '1px solid var(--border)',
              }}
              onMouseEnter={(e) => {
                if (currentPage !== page)
                  e.currentTarget.style.backgroundColor = 'var(--surface2)';
              }}
              onMouseLeave={(e) => {
                if (currentPage !== page)
                  e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {page}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-7 h-7 flex items-center justify-center rounded-md font-mono text-xs transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            border: '1px solid var(--border)',
            color: 'var(--text2)',
          }}
          onMouseEnter={(e) => {
            if (currentPage !== totalPages)
              e.currentTarget.style.backgroundColor = 'var(--surface2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          →
        </button>
      </div>
    </div>
  );
}