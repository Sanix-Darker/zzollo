import React, { useMemo, useCallback } from "react";
import classNames from "classnames";
import { Paginate, DOTS } from "./paginate";
import "./pagination.css";

/**
 * Pagination component (memo‑ised)
 * @param {Object} props
 */
const Pagination = React.memo(
  ({
    onPageChange,
    onViewAll,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
    className,
    showViewAll = true,
  }) => {
    /* ---------------------- derived data ---------------------- */
    const paginationRange = useMemo(
      () =>
        Paginate({
          currentPage,
          totalCount,
          siblingCount,
          pageSize,
        }),
      [currentPage, totalCount, siblingCount, pageSize]
    );

    const lastPage = useMemo(
      () => paginationRange[paginationRange.length - 1],
      [paginationRange]
    );

    /* ---------------------- early exit ----------------------- */
    if (currentPage === 0 || paginationRange.length < 2) return null;

    /* ---------------------- handlers ------------------------- */
    const handlePrev = useCallback(() => {
      if (currentPage > 1) onPageChange(currentPage - 1);
    }, [currentPage, onPageChange]);

    const handleNext = useCallback(() => {
      if (currentPage < lastPage) onPageChange(currentPage + 1);
    }, [currentPage, lastPage, onPageChange]);

    const handleViewAll = useCallback(() => onViewAll(totalCount), [onViewAll, totalCount]);

    /* ---------------------- render --------------------------- */
    return (
      <div>
        <ul className={classNames("pagination-container", className)}>
          <li
            className={classNames("pagination-item", { disabled: currentPage === 1 })}
            aria-disabled={currentPage === 1}
            onClick={handlePrev}
          >
            <span className="arrow left" />
          </li>

          {paginationRange.map((pageNumber, idx) =>
            pageNumber === DOTS ? (
              <li key={`dots-${idx}`} className="pagination-item dots">
                &#8230;
              </li>
            ) : (
              <li
                key={pageNumber}
                className={classNames("pagination-item", { selected: pageNumber === currentPage })}
                aria-current={pageNumber === currentPage ? "page" : undefined}
                onClick={() => onPageChange(pageNumber)}
              >
                {pageNumber}
              </li>
            )
          )}

          <li
            className={classNames("pagination-item", { disabled: currentPage === lastPage })}
            aria-disabled={currentPage === lastPage}
            onClick={handleNext}
          >
            <span className="arrow right" />
          </li>
        </ul>

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
  }
);

export default Pagination;
