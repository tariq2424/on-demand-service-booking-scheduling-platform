import React, { useState } from "react";

export default function DataTable({
  title,
  columns,
  data,
  loading,
  searchKeys = [],
  renderRow,
  headerAction,
  emptyMessage = "No data found",
}) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 7;

  const filtered = data.filter((item) =>
    searchKeys.some((key) => {
      const keys = key.split(".");
      let val = item;
      for (const k of keys) val = val?.[k];
      return String(val || "")
        .toLowerCase()
        .includes(search.toLowerCase());
    }),
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / recordsPerPage));
  const startIdx = (currentPage - 1) * recordsPerPage;
  const currentRows = filtered.slice(startIdx, startIdx + recordsPerPage);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="card">
      <div className="card-header d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <h5 className="mb-0">{title}</h5>
        <div className="d-flex gap-2 align-items-center flex-wrap">
          <div className="input-group" style={{ maxWidth: 200 }}>
            <span className="input-group-text">
              <i className="bx bx-search" />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search..."
              value={search}
              onChange={handleSearch}
            />
          </div>
          {headerAction}
        </div>
      </div>

      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: "50px" }}>#</th>
                {columns.map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length + 1} className="text-center py-5">
                    <div
                      className="spinner-border text-primary"
                      style={{ width: "30px", height: "30px" }}
                    />
                    <p className="mt-2 text-muted mb-0">Loading...</p>
                  </td>
                </tr>
              ) : currentRows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="text-center py-5">
                    <i
                      className="bx bx-search-alt"
                      style={{ fontSize: "40px", color: "#ccc" }}
                    />
                    <p className="mt-2 text-muted mb-0">{emptyMessage}</p>
                  </td>
                </tr>
              ) : (
                currentRows.map((item, i) => renderRow(item, startIdx + i + 1))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {!loading && filtered.length > 0 && (
        <div className="card-footer d-flex justify-content-between align-items-center flex-wrap gap-2">
          <small className="text-muted">
            Showing {startIdx + 1}–
            {Math.min(startIdx + recordsPerPage, filtered.length)} of{" "}
            {filtered.length} entries
          </small>
          <ul className="pagination mb-0 pagination-sm">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <i className="bx bx-chevron-left" />
              </button>
            </li>
            {[...Array(totalPages)].map((_, i) => {
              const p = i + 1;
              if (
                totalPages > 7 &&
                Math.abs(p - currentPage) > 2 &&
                p !== 1 &&
                p !== totalPages
              )
                return null;
              return (
                <li
                  key={p}
                  className={`page-item ${currentPage === p ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(p)}
                  >
                    {p}
                  </button>
                </li>
              );
            })}
            <li
              className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                <i className="bx bx-chevron-right" />
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
