import React, { useCallback } from "react";
import classNames from "classnames";
import { Paginate, DOTS } from "./paginate";
import "./pagination.css";

/**
 * Hook‑safe, accessible pagination component
 */
const Pagination = React.memo(function Pagination({
  onPageChange,
  onViewAll,
  totalCount,
  siblingCount = 1,
  currentPage,
  pageSize,
  className,
  showViewAll = true,
}) {
  /* ---------------------- derive range --------------------- */
  const paginationRange = Paginate({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  const lastPage = paginationRange[paginationRange.length - 1];

  // early‑display check (hooks must come first!)
  const hidePagination = currentPage === 0 || paginationRange.length < 2;

  /* ---------------------- callbacks ------------------------ */
  const handlePrev = useCallback(() => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  }, [currentPage, onPageChange]);

  const handleNext = useCallback(() => {
    if (currentPage < lastPage) onPageChange(currentPage + 1);
  }, [currentPage, lastPage, onPageChange]);

  const handleViewAll = useCallback(
    () => onViewAll(totalCount),
    [onViewAll, totalCount]
  );

  /* ---------------------- early exit ----------------------- */
  if (hidePagination) return null;

  /* ---------------------- render --------------------------- */
  return (
    <div>
      <ul className={classNames("pagination-container", className)}>
        {/* prev */}
        <li
          className={classNames("pagination-item", { disabled: currentPage === 1 })}
          onClick={handlePrev}
        >
          <span className="arrow left" />
        </li>

        {/* pages */}
        {paginationRange.map((pageNumber, idx) =>
          pageNumber === DOTS ? (
            <li key={`dots-${idx}`} className="pagination-item dots">
              &#8230;
            </li>
          ) : (
            <li
              key={pageNumber}
              className={classNames("pagination-item", {
                selected: pageNumber === currentPage,
              })}
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </li>
          )
        )}

        {/* next */}
        <li
          className={classNames("pagination-item", { disabled: currentPage === lastPage })}
          onClick={handleNext}
        >
          <span className="arrow right" />
        </li>
      </ul>

      {/* view all */}
      {showViewAll && (
        <button
          type="button"
          title="Show all results on one page (may affect performance)"
          className="button-get-all"
          onClick={handleViewAll}
        >
          Toggle pagination
        </button>
      )}
    </div>
  );
});

export default Pagination;
