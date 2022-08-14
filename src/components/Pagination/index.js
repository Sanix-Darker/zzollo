import React from 'react';
import classnames from 'classnames';
import { Paginate, DOTS } from './paginate';
import './pagination.css';

const Pagination = props => {
  const {
    onPageChange,
    onViewAll,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
    className
  } = props;

  const paginationRange = Paginate({
    currentPage,
    totalCount,
    siblingCount,
    pageSize
  });

  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  const onDisplayAll = () => {
    onViewAll(totalCount);
  }

  let lastPage = paginationRange[paginationRange.length - 1];
  return (
    <div style={{"display":"bloc"}}>
      <ul
        className={classnames('pagination-container', { [className]: className })}
      >
        <li
          className={classnames('pagination-item', {
            disabled: currentPage === 1
          })}
          onClick={onPrevious}
        >
          <div className="arrow left" />
        </li>
        {paginationRange.map(pageNumber => {

          if (pageNumber === DOTS) {
            return <li key={pageNumber} className="pagination-item dots">&#8230;</li>;
          }

          return (
            <li
              key={pageNumber}
              className={classnames('pagination-item', {
                selected: pageNumber === currentPage
              })}
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </li>
          );
        })}
        <li
          className={classnames('pagination-item', {
            disabled: currentPage === lastPage
          })}
          onClick={onNext}
        >
          <div className="arrow right" />
        </li>
      </ul>
      <button
        title='Click here to see research results without pagination'
        className='button-get-all'
        onClick={onDisplayAll}>Toggle Paggination</button>

    </div>
  );
};

export default Pagination;
