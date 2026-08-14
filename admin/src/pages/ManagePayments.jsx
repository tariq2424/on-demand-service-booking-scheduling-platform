import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminLayout from "../common/AdminLayout";
import DataTable from "../common/DataTable";
import { getPayments } from "../services/api";

export default function ManagePayments({ setIsAuthenticated, adminName }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPayments()
      .then((r) => setPayments(r.data.data || []))
      .catch(() => toast.error("Failed to load payments"))
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = payments.filter((p) => p.status === "Success").reduce((s, p) => s + (p.amount || 0), 0);

  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated} adminName={adminName}>
      <div className="row mb-4">
        <div className="col-12">
          <h4 className="fw-bold mb-1">Manage Payments</h4>
          <p className="text-muted">View all payment transactions and revenue reports.</p>
        </div>
      </div>

      {/* Revenue summary */}
      {!loading && (
        <div className="row g-3 mb-4">
          {[
            { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}`, icon: "bx-rupee", color: "#4caf50", bg: "#e8f5e9" },
            { label: "Successful", value: payments.filter((p) => p.status === "Success").length, icon: "bx-check-circle", color: "#4caf50", bg: "#e8f5e9" },
            { label: "Pending", value: payments.filter((p) => p.status === "Pending").length, icon: "bx-time", color: "#ffab00", bg: "#fff7e0" },
            { label: "Failed", value: payments.filter((p) => p.status === "Failed").length, icon: "bx-x-circle", color: "#ff3e1d", bg: "#ffe9e6" },
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
        title="Payment Transactions"
        columns={["Customer", "Service", "Amount", "Method", "Transaction ID", "Date", "Status"]}
        data={payments}
        loading={loading}
        searchKeys={["user.name", "user.email", "service.name", "transaction_id", "payment_type", "status"]}
        emptyMessage="No payment records yet."
        renderRow={(p, idx) => (
          <tr key={p._id}>
            <td>{idx}</td>
            <td>
              <div>
                <p className="mb-0 fw-semibold" style={{ fontSize: "14px" }}>{p.user?.name || "—"}</p>
                <small className="text-muted">{p.user?.email}</small>
              </div>
            </td>
            <td><span className="text-muted" style={{ fontSize: "13px" }}>{p.service?.name || "—"}</span></td>
            <td><strong className="text-success" style={{ fontSize: "15px" }}>₹{p.amount}</strong></td>
            <td>
              <span className="badge bg-label-info">{p.payment_type || "Razorpay"}</span>
            </td>
            <td>
              <code style={{ fontSize: "11px", background: "#f8f9fa", padding: "2px 6px", borderRadius: "4px" }}>
                {p.transaction_id?.slice(0, 18) || "—"}
              </code>
            </td>
            <td><span className="text-muted" style={{ fontSize: "13px" }}>{p.payment_date ? new Date(p.payment_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}</span></td>
            <td>
              <span className={`badge ${p.status === "Success" ? "bg-label-success" : p.status === "Pending" ? "bg-label-warning" : "bg-label-danger"}`}>
                {p.status}
              </span>
            </td>
          </tr>
        )}
      />
    </AdminLayout>
  );
}
