import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../common/AdminLayout";
import { getDashboardStats } from "../services/api";

export default function Dashboard({ setIsAuthenticated, adminName }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then((r) => setStats(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats
    ? [
        { label: "Total Users", value: stats.totalUsers, sub: `${stats.activeUsers} active`, icon: "bx-user", color: "#696cff", bg: "#eeedfd" },
        { label: "Total Categories", value: stats.totalCategories, sub: "Service categories", icon: "bx-category", color: "#03c3ec", bg: "#e0f8ff" },
        { label: "Total Services", value: stats.totalServices, sub: "Available services", icon: "bx-wrench", color: "#4caf50", bg: "#e8f5e9" },
        { label: "Total Bookings", value: stats.totalBookings, sub: `${stats.ongoingBookings} ongoing`, icon: "bx-calendar-check", color: "#ff3e1d", bg: "#ffe9e6" },
        { label: "Completed", value: stats.completedBookings, sub: "Bookings completed", icon: "bx-check-circle", color: "#4caf50", bg: "#e8f5e9" },
        { label: "Cancelled", value: stats.cancelledBookings, sub: "Bookings cancelled", icon: "bx-x-circle", color: "#ff3e1d", bg: "#ffe9e6" },
        { label: "Total Revenue", value: `₹${stats.totalRevenue?.toLocaleString() || 0}`, sub: "Successful payments", icon: "bx-rupee", color: "#ffab00", bg: "#fff7e0" },
        { label: "Avg. Rating", value: `${stats.avgRating}/5`, sub: "Customer rating", icon: "bx-star", color: "#ffab00", bg: "#fff7e0" },
      ]
    : [];

  const statusBadge = (status) => {
    const map = {
      Ongoing: { bg: "#fff3cd", color: "#856404" },
      Completed: { bg: "#d4edda", color: "#155724" },
      Cancelled: { bg: "#f8d7da", color: "#721c24" },
      Success: { bg: "#d4edda", color: "#155724" },
      Pending: { bg: "#fff3cd", color: "#856404" },
      Failed: { bg: "#f8d7da", color: "#721c24" },
    };
    const s = map[status] || { bg: "#e2e3e5", color: "#383d41" };
    return (
      <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "600", background: s.bg, color: s.color }}>
        {status}
      </span>
    );
  };

  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated} adminName={adminName}>
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="fw-bold mb-1">Dashboard</h4>
              <p className="text-muted mb-0">Welcome back, {adminName || "Admin"}! Here's what's happening.</p>
            </div>
            <Link to="/manage-bookings" className="btn btn-primary">
              <i className="bx bx-calendar me-1" /> View Bookings
            </Link>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
          <p className="mt-3 text-muted">Loading dashboard...</p>
        </div>
      ) : (
        <>
          {/* ── Stat Cards ── */}
          <div className="row g-4 mb-4">
            {statCards.map((card, i) => (
              <div className="col-xl-3 col-md-6" key={i}>
                <div className="card h-100">
                  <div className="card-body">
                    <div className="d-flex align-items-start justify-content-between mb-4">
                      <div>
                        <p className="mb-1" style={{ color: "#697a8d", fontSize: "14px" }}>{card.label}</p>
                        <h3 className="mb-0 fw-bold" style={{ color: card.color }}>{card.value}</h3>
                      </div>
                      <div style={{ width: "46px", height: "46px", borderRadius: "10px", background: card.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <i className={`bx ${card.icon}`} style={{ fontSize: "22px", color: card.color }} />
                      </div>
                    </div>
                    <p className="mb-0" style={{ fontSize: "12px", color: "#a1acb8" }}>{card.sub}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Recent Bookings ── */}
          <div className="row g-4 mb-4">
            <div className="col-12">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Recent Bookings</h5>
                  <Link to="/manage-bookings" className="btn btn-sm btn-outline-primary">
                    View All
                  </Link>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>#</th>
                          <th>Customer</th>
                          <th>Service</th>
                          <th>Booked On</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Payment</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats?.recentBookings?.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="text-center py-4 text-muted">
                              No bookings yet
                            </td>
                          </tr>
                        ) : (
                          stats?.recentBookings?.map((b, i) => (
                            <tr key={b._id}>
                              <td>{i + 1}</td>
                              <td>
                                <div>
                                  <p className="mb-0 fw-semibold" style={{ fontSize: "14px" }}>{b.user?.name || "—"}</p>
                                  <small className="text-muted">{b.user?.email}</small>
                                </div>
                              </td>
                              <td>
                                <span style={{ fontSize: "14px" }}>{b.service?.name || "—"}</span>
                              </td>
                              <td>
                                <span style={{ fontSize: "13px", color: "#697a8d" }}>
                                  {b.booking_datetime ? new Date(b.booking_datetime).toLocaleDateString("en-IN") : "—"}
                                </span>
                              </td>
                              <td>
                                <strong style={{ color: "#4caf50" }}>₹{b.amount || b.service?.price || "—"}</strong>
                              </td>
                              <td>{statusBadge(b.status)}</td>
                              <td>{statusBadge(b.payment_status || "Pending")}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Recent Payments ── */}
          <div className="row g-4">
            <div className="col-12">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Recent Payments</h5>
                  <Link to="/manage-payments" className="btn btn-sm btn-outline-primary">
                    View All
                  </Link>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>#</th>
                          <th>Customer</th>
                          <th>Amount</th>
                          <th>Method</th>
                          <th>Transaction ID</th>
                          <th>Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats?.recentPayments?.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="text-center py-4 text-muted">
                              No payments yet
                            </td>
                          </tr>
                        ) : (
                          stats?.recentPayments?.map((p, i) => (
                            <tr key={p._id}>
                              <td>{i + 1}</td>
                              <td>
                                <div>
                                  <p className="mb-0 fw-semibold" style={{ fontSize: "14px" }}>{p.user?.name || "—"}</p>
                                  <small className="text-muted">{p.user?.email}</small>
                                </div>
                              </td>
                              <td><strong style={{ color: "#4caf50" }}>₹{p.amount}</strong></td>
                              <td><span className="badge bg-label-primary">{p.payment_type}</span></td>
                              <td><code style={{ fontSize: "11px" }}>{p.transaction_id?.slice(0, 16)}...</code></td>
                              <td><span style={{ fontSize: "13px", color: "#697a8d" }}>{new Date(p.payment_date).toLocaleDateString("en-IN")}</span></td>
                              <td>{statusBadge(p.status)}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
