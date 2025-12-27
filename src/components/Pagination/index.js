import React, { useMemo } from "react";
import "./pagination.css";

function Pagination({ currentPage, totalCount, pageSize, onPageChange }) {
  const totalPages = Math.ceil(totalCount / pageSize);

  const pages = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const items = [];
    const showLeftDots = currentPage > 3;
    const showRightDots = currentPage < totalPages - 2;

    if (!showLeftDots && showRightDots) {
      for (let i = 1; i <= 5; i++) items.push(i);
      items.push("...");
      items.push(totalPages);
    } else if (showLeftDots && !showRightDots) {
      items.push(1);
      items.push("...");
      for (let i = totalPages - 4; i <= totalPages; i++) items.push(i);
    } else {
      items.push(1);
      items.push("...");
      for (let i = currentPage - 1; i <= currentPage + 1; i++) items.push(i);
      items.push("...");
      items.push(totalPages);
    }

    return items;
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        className="page-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        ←
      </button>

      {pages.map((page, i) =>
        page === "..." ? (
          <span key={`dots-${i}`} className="page-dots">...</span>
        ) : (
          <button
            key={page}
            className={`page-btn ${page === currentPage ? "active" : ""}`}
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </button>
        )
      )}

      <button
        className="page-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        →
      </button>
    </nav>
  );
}

export default Pagination;
