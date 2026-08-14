import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminLayout from "../common/AdminLayout";
import DataTable from "../common/DataTable";
import { getFeedbacks } from "../services/api";

const BACKEND = "http://localhost:8000";

export default function ManageFeedbacks({ setIsAuthenticated, adminName }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeedbacks()
      .then((r) => setFeedbacks(r.data.data || []))
      .catch(() => toast.error("Failed to load feedbacks"))
      .finally(() => setLoading(false));
  }, []);

  const avgRating =
    feedbacks.length > 0
      ? (feedbacks.reduce((s, f) => s + (f.rating || 0), 0) / feedbacks.length).toFixed(1)
      : "—";

  const StarRating = ({ rating }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <i
          key={s}
          className={`bx ${s <= Math.round(rating) ? "bxs-star" : "bx-star"}`}
          style={{ color: s <= Math.round(rating) ? "#ffab00" : "#ccc", fontSize: "14px" }}
        />
      ))}
      <span style={{ marginLeft: "4px", fontSize: "12px", color: "#697a8d" }}>({rating})</span>
    </div>
  );

  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated} adminName={adminName}>
      <div className="row mb-4">
        <div className="col-12">
          <h4 className="fw-bold mb-1">Manage Feedbacks</h4>
          <p className="text-muted">Monitor customer reviews and service ratings.</p>
        </div>
      </div>

      {/* Summary */}
      {!loading && (
        <div className="row g-3 mb-4">
          {[
            { label: "Total Reviews", value: feedbacks.length, icon: "bx-comment", color: "#696cff", bg: "#eeedfd" },
            { label: "Average Rating", value: `${avgRating}/5`, icon: "bxs-star", color: "#ffab00", bg: "#fff7e0" },
            { label: "5 Star Reviews", value: feedbacks.filter((f) => f.rating === 5).length, icon: "bxs-star-half", color: "#4caf50", bg: "#e8f5e9" },
            { label: "Below 3 Stars", value: feedbacks.filter((f) => f.rating < 3).length, icon: "bx-star", color: "#ff3e1d", bg: "#ffe9e6" },
          ].map((s) => (
            <div className="col-md-3 col-6" key={s.label}>
              <div className="card h-100">
                <div className="card-body d-flex align-items-center gap-3">
                  <div style={{ width: "46px", height: "46px", borderRadius: "10px", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <i className={`bx ${s.icon}`} style={{ fontSize: "22px", color: s.color }} />
                  </div>
                  <div>
                    <p className="text-muted mb-0" style={{ fontSize: "12px" }}>{s.label}</p>
                    <h5 className="fw-bold mb-0" style={{ color: s.color }}>{s.value}</h5>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <DataTable
        title="All Customer Feedbacks"
        columns={["Customer", "Service", "Rating", "Review", "Date"]}
        data={feedbacks}
        loading={loading}
        searchKeys={["user.name", "service.name", "feedback"]}
        emptyMessage="No feedbacks submitted yet."
        renderRow={(fb, idx) => (
          <tr key={fb._id}>
            <td>{idx}</td>
            <td>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {fb.user?.profile_image ? (
                  <img
                    src={`${BACKEND}${fb.user.profile_image}`}
                    alt={fb.user.name}
                    style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                ) : (
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "50%",
                    background: "linear-gradient(135deg,#696cff,#9155fd)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontWeight: "700", fontSize: "14px", flexShrink: 0
                  }}>
                    {fb.user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <div>
                  <p className="mb-0 fw-semibold" style={{ fontSize: "13px" }}>{fb.user?.name || "—"}</p>
                  <small className="text-muted">{fb.user?.email}</small>
                </div>
              </div>
            </td>
            <td>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {fb.service?.image && (
                  <img
                    src={`${BACKEND}${fb.service.image}`}
                    alt={fb.service?.name}
                    style={{ width: "32px", height: "32px", borderRadius: "6px", objectFit: "cover" }}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                )}
                <span style={{ fontSize: "13px" }}>{fb.service?.name || "—"}</span>
              </div>
            </td>
            <td><StarRating rating={fb.rating} /></td>
            <td>
              <p style={{ maxWidth: "250px", fontSize: "13px", color: "#697a8d", margin: 0, whiteSpace: "normal" }}>
                "{fb.feedback?.slice(0, 100)}{fb.feedback?.length > 100 ? "..." : ""}"
              </p>
            </td>
            <td>
              <span className="text-muted" style={{ fontSize: "12px" }}>
                {fb.datetime ? new Date(fb.datetime).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
              </span>
            </td>
          </tr>
        )}
      />
    </AdminLayout>
  );
}
