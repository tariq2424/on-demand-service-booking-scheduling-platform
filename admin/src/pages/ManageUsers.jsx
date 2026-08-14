import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminLayout from "../common/AdminLayout";
import DataTable from "../common/DataTable";
import { getUsers, updateUserStatus } from "../services/api";

const BACKEND = "http://localhost:8000";

export default function ManageUsers({ setIsAuthenticated, adminName }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getUsers();
      setUsers(res.data.data || []);
    } catch { toast.error("Failed to load users"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === "Active" ? "Inactive" : "Active";
    if (!window.confirm(`${newStatus === "Active" ? "Activate" : "Deactivate"} ${user.name}?`)) return;
    setToggling(user._id);
    try {
      const res = await updateUserStatus({ user_id: user._id, status: newStatus });
      if (res.data.success) {
        toast.success(`User ${newStatus === "Active" ? "activated" : "deactivated"} successfully!`);
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed!");
    } finally { setToggling(null); }
  };

  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated} adminName={adminName}>
      <div className="row mb-4">
        <div className="col-12">
          <h4 className="fw-bold mb-1">Manage Users</h4>
          <p className="text-muted">View and manage registered users. Activate or deactivate accounts.</p>
        </div>
      </div>

      {/* Summary */}
      {!loading && users.length > 0 && (
        <div className="row g-3 mb-4">
          {[
            { label: "Total Users", count: users.length, color: "#696cff", icon: "bx-user" },
            { label: "Active Users", count: users.filter((u) => u.status === "Active").length, color: "#4caf50", icon: "bx-user-check" },
            { label: "Inactive Users", count: users.filter((u) => u.status === "Inactive").length, color: "#ff3e1d", icon: "bx-user-x" },
          ].map((s) => (
            <div className="col-md-4" key={s.label}>
              <div className="card">
                <div className="card-body d-flex align-items-center gap-3">
                  <div style={{ width: "46px", height: "46px", borderRadius: "10px", background: `${s.color}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <i className={`bx ${s.icon}`} style={{ fontSize: "22px", color: s.color }} />
                  </div>
                  <div>
                    <p className="text-muted mb-0" style={{ fontSize: "13px" }}>{s.label}</p>
                    <h4 className="fw-bold mb-0" style={{ color: s.color }}>{s.count}</h4>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <DataTable
        title="All Users"
        columns={["Avatar", "Name", "Email", "Phone", "Address", "Status", "Joined", "Action"]}
        data={users}
        loading={loading}
        searchKeys={["name", "email", "phone", "address", "status"]}
        emptyMessage="No users registered yet."
        renderRow={(user, idx) => (
          <tr key={user._id}>
            <td>{idx}</td>
            <td>
              {user.profile_image ? (
                <img
                  src={`${BACKEND}${user.profile_image}`}
                  alt={user.name}
                  style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }}
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              ) : (
                <div style={{
                  width: "40px", height: "40px", borderRadius: "50%",
                  background: "linear-gradient(135deg,#4caf50,#2e7d32)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: "700", fontSize: "16px"
                }}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </td>
            <td><strong style={{ fontSize: "14px" }}>{user.name}</strong></td>
            <td><span className="text-muted" style={{ fontSize: "13px" }}>{user.email}</span></td>
            <td><span style={{ fontSize: "13px" }}>{user.phone}</span></td>
            <td><span className="text-muted" style={{ fontSize: "13px" }}>{user.address?.slice(0, 30)}</span></td>
            <td>
              <span className={`badge ${user.status === "Active" ? "bg-label-success" : "bg-label-danger"}`}>
                {user.status}
              </span>
            </td>
            <td><span className="text-muted" style={{ fontSize: "12px" }}>{user.created_at ? new Date(user.created_at).toLocaleDateString("en-IN") : "—"}</span></td>
            <td>
              <button
                className={`btn btn-sm ${user.status === "Active" ? "btn-outline-danger" : "btn-outline-success"}`}
                onClick={() => handleToggleStatus(user)}
                disabled={toggling === user._id}
                title={user.status === "Active" ? "Deactivate user" : "Activate user"}
              >
                {toggling === user._id
                  ? <span className="spinner-border spinner-border-sm" />
                  : user.status === "Active"
                  ? <><i className="bx bx-user-x me-1" />Deactivate</>
                  : <><i className="bx bx-user-check me-1" />Activate</>
                }
              </button>
            </td>
          </tr>
        )}
      />
    </AdminLayout>
  );
}
