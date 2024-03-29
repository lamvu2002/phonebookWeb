import React from "react";
import { Pagination } from "react-bootstrap";
import "./Pagination.css";
const PaginationComponent = ({ currentPage, totalPages, handlePageChange }) => {
  const renderPaginationItems = () => {
    const paginationItems = [];

    // Add "First" and "Prev" pagination items
    paginationItems.push(
      <Pagination.First
        key="pagination-first"
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
      />
    );
    paginationItems.push(
      <Pagination.Prev
        key="pagination-prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      />
    );

    if (totalPages <= 5) {
      // Render all page numbers if there are 5 or fewer pages
      for (let i = 1; i <= totalPages; i++) {
        paginationItems.push(
          <Pagination.Item
            key={`pagination-item-${i}`}
            active={i === currentPage}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </Pagination.Item>
        );
      }
    } else {
      // Render dynamic pagination items
      if (currentPage <= 2) {
        // Render first 3 pages followed by an ellipsis
        for (let i = 1; i <= 3; i++) {
          paginationItems.push(
            <Pagination.Item
              key={`pagination-item-${i}`}
              active={i === currentPage}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </Pagination.Item>
          );
        }
        paginationItems.push(<Pagination.Ellipsis key="pagination-ellipsis" />);
      } else if (currentPage >= totalPages - 1) {
        // Render last 3 pages preceded by an ellipsis
        paginationItems.push(<Pagination.Ellipsis key="pagination-ellipsis" />);
        for (let i = totalPages - 2; i <= totalPages; i++) {
          paginationItems.push(
            <Pagination.Item
              key={`pagination-item-${i}`}
              active={i === currentPage}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </Pagination.Item>
          );
        }
      } else {
        // Render current page, previous page, and next page
        paginationItems.push(
          <Pagination.Item
            key={`pagination-item-${currentPage - 1}`}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            {currentPage - 1}
          </Pagination.Item>
        );
        paginationItems.push(
          <Pagination.Item key={`pagination-item-${currentPage}`} active>
            {currentPage}
          </Pagination.Item>
        );
        paginationItems.push(
          <Pagination.Item
            key={`pagination-item-${currentPage + 1}`}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            {currentPage + 1}
          </Pagination.Item>
        );
      }
    }

    // Add "Next" and "Last" pagination items
    paginationItems.push(
      <Pagination.Next
        key="pagination-next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      />
    );
    paginationItems.push(
      <Pagination.Last
        key="pagination-last"
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
      />
    );

    return paginationItems;
  };

  return (
    <Pagination className="custom-pagination">
      {renderPaginationItems()}
    </Pagination>
  );
};

export default PaginationComponent;
