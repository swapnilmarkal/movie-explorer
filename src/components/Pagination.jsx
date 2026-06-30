import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const PAGE_SIZE = 10;

export function getTotalPages(totalResults) {
  if (!totalResults) return 0;
  return Math.ceil(totalResults / PAGE_SIZE);
}

function Pagination({ page, totalResults, onPageChange }) {
  const totalPages = getTotalPages(totalResults);

  if (totalPages <= 1) return null;

  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);

  for (let i = start; i <= end; i += 1) {
    pages.push(i);
  }

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        type="button"
        className="pagination-btn"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
      >
        <FiChevronLeft />
        Prev
      </button>

      <div className="pagination-pages">
        {start > 1 && (
          <>
            <button
              type="button"
              className="pagination-page"
              onClick={() => onPageChange(1)}
            >
              1
            </button>
            {start > 2 && <span className="pagination-ellipsis">…</span>}
          </>
        )}

        {pages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            className={`pagination-page ${pageNumber === page ? "pagination-page--active" : ""}`}
            onClick={() => onPageChange(pageNumber)}
            aria-current={pageNumber === page ? "page" : undefined}
          >
            {pageNumber}
          </button>
        ))}

        {end < totalPages && (
          <>
            {end < totalPages - 1 && (
              <span className="pagination-ellipsis">…</span>
            )}
            <button
              type="button"
              className="pagination-page"
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      <button
        type="button"
        className="pagination-btn"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
      >
        Next
        <FiChevronRight />
      </button>
    </nav>
  );
}

export default Pagination;
