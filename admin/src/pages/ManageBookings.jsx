import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminLayout from "../common/AdminLayout";
import DataTable from "../common/DataTable";
import { getBookings, updateBooking } from "../services/api";

const BACKEND = "https://on-demand-service-booking-scheduling.onrender.com";

export default function ManageBookings({ setIsAuthenticated, adminName }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ status: "", start_datetime: "", complete_datetime: "" });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getBookings();
      setBookings(res.data.data || []);
    } catch { toast.error("Failed to load bookings"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openUpdate = (b) => {
    setSelected(b);
    setForm({
      status: b.status,
      start_datetime: b.start_datetime ? new Date(b.start_datetime).toISOString().slice(0, 16) : "",
      complete_datetime: b.complete_datetime ? new Date(b.complete_datetime).toISOString().slice(0, 16) : "",
    });
    setModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { id: selected._id, status: form.status };
      if (form.start_datetime) payload.start_datetime = form.start_datetime;
      if (form.complete_datetime) payload.complete_datetime = form.complete_datetime;
      const res = await updateBooking(payload);
      if (res.data.success) {
        toast.success("Booking updated successfully!");
        setModal(false);
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed!");
    } finally { setSaving(false); }
  };

  const statusBadge = (status) => {
    const map = {
      Ongoing: "bg-label-warning",
      Completed: "bg-label-success",
      Cancelled: "bg-label-danger",
    };
    return <span className={`badge ${map[status] || "bg-label-secondary"}`}>{status}</span>;
  };

  const paymentBadge = (status) => {
    const map = { Success: "bg-label-success", Pending: "bg-label-warning", Failed: "bg-label-danger" };
    return <span className={`badge ${map[status] || "bg-label-secondary"}`}>{status || "Pending"}</span>;
  };

  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated} adminName={adminName}>
      <div className="row mb-4">
        <div className="col-12">
          <h4 className="fw-bold mb-1">Manage Bookings</h4>
          <p className="text-muted">View all bookings, update status, and manage schedules.</p>
        </div>
      </div>

      {/* Summary strip */}
      {!loading && bookings.length > 0 && (
        <div className="row g-3 mb-4">
          {[
            { label: "Total", count: bookings.length, color: "#696cff", bg: "#eeedfd" },
            { label: "Ongoing", count: bookings.filter((b) => b.status === "Ongoing").length, color: "#ffab00", bg: "#fff7e0" },
            { label: "Completed", count: bookings.filter((b) => b.status === "Completed").length, color: "#4caf50", bg: "#e8f5e9" },
            { label: "Cancelled", count: bookings.filter((b) => b.status === "Cancelled").length, color: "#ff3e1d", bg: "#ffe9e6" },
          ].map((s) => (
            <div className="col-md-3 col-6" key={s.label}>
              <div className="card" style={{ borderLeft: `4px solid ${s.color}` }}>
                <div className="card-body py-3">
                  <p className="text-muted mb-1" style={{ fontSize: "12px" }}>{s.label} Bookings</p>
                  <h4 className="fw-bold mb-0" style={{ color: s.color }}>{s.count}</h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <DataTable
        title="All Bookings"
        columns={["Customer", "Service", "Booked On", "Amount", "Status", "Payment", "Actions"]}
        data={bookings}
        loading={loading}
        searchKeys={["user.name", "user.email", "service.name", "status", "payment_status"]}
        emptyMessage="No bookings yet."
        renderRow={(b, idx) => (
          <tr key={b._id}>
            <td>{idx}</td>
            <td>
              <div>
                <p className="mb-0 fw-semibold" style={{ fontSize: "14px" }}>{b.user?.name || "—"}</p>
                <small className="text-muted">{b.user?.phone}</small>
              </div>
            </td>
            <td>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <img
                  src={b.service?.image ? `${BACKEND}${b.service.image}` : "/assets/img/avatars/1.png"}
                  alt=""
                  style={{ width: "36px", height: "36px", borderRadius: "6px", objectFit: "cover" }}
                  onError={(e) => { e.target.src = "/assets/img/avatars/1.png"; }}
                />
                <div>
                  <p className="mb-0 fw-semibold" style={{ fontSize: "13px" }}>{b.service?.name || "—"}</p>
                  <small className="text-muted">{b.category?.name}</small>
                </div>
              </div>
            </td>
            <td><span className="text-muted" style={{ fontSize: "13px" }}>{b.booking_datetime ? new Date(b.booking_datetime).toLocaleDateString("en-IN") : "—"}</span></td>
            <td><strong className="text-success">₹{b.amount || b.service?.price || "—"}</strong></td>
            <td>{statusBadge(b.status)}</td>
            <td>{paymentBadge(b.payment_status)}</td>
            <td>
              <button className="btn btn-sm btn-outline-primary" onClick={() => openUpdate(b)} title="Update booking">
                <i className="bx bx-edit" />
              </button>
            </td>
          </tr>
        )}
      />

      {/* Update Modal */}
      {modal && selected && (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Booking</h5>
                <button type="button" className="btn-close" onClick={() => setModal(false)} />
              </div>
              <form onSubmit={handleUpdate}>
                <div className="modal-body">
                  {/* Info */}
                  <div className="alert alert-light mb-3" style={{ fontSize: "13px" }}>
                    <p className="mb-1"><strong>Customer:</strong> {selected.user?.name}</p>
                    <p className="mb-1"><strong>Service:</strong> {selected.service?.name}</p>
                    <p className="mb-0"><strong>Amount:</strong> ₹{selected.amount || selected.service?.price}</p>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Booking Status</label>
                    <select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} required>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Service Start Date & Time</label>
                    <input type="datetime-local" className="form-control" value={form.start_datetime} onChange={(e) => setForm({ ...form, start_datetime: e.target.value })} />
                    <small className="text-muted">Leave empty to keep unchanged</small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Service Completion Date & Time</label>
                    <input type="datetime-local" className="form-control" value={form.complete_datetime} onChange={(e) => setForm({ ...form, complete_datetime: e.target.value })} />
                    <small className="text-muted">Leave empty to keep unchanged</small>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? <><span className="spinner-border spinner-border-sm me-1" />Updating...</> : "Update Booking"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}


