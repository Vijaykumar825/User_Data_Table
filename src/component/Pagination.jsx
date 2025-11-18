import React from "react";

export default function Pagination({
  currentPage,
  totalPages,
  onPrev,
  onNext,
}) {
  return (
    <div className="pagination">
      <button className="btn" disabled={currentPage === 1} onClick={onPrev}>
        Prev
      </button>
      <span className="pageInfo">
        Page {currentPage} of {totalPages}
      </span>
      <button
        className="btn"
        disabled={currentPage === totalPages}
        onClick={onNext}
      >
        Next
      </button>
    </div>
  );
}
