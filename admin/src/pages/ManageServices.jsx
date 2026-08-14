import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminLayout from "../common/AdminLayout";
import DataTable from "../common/DataTable";
import { getAdminServices, getAdminCategories, addService, updateService, deleteService } from "../services/api";

const BACKEND = "http://localhost:8000";
const emptyForm = { name: "", description: "", price: "", category_id: "", status: "Active" };

export default function ManageServices({ setIsAuthenticated, adminName }) {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [svcRes, catRes] = await Promise.all([getAdminServices(), getAdminCategories()]);
      setServices(svcRes.data.data || []);
      setCategories(catRes.data.data || []);
    } catch { toast.error("Failed to load services"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setImageFile(null);
    setPreview(null);
    setModal(true);
  };

  const openEdit = (svc) => {
    setEditing(svc);
    setForm({ name: svc.name, description: svc.description, price: svc.price, category_id: svc.category_id || svc.category?._id || "", status: svc.status });
    setImageFile(null);
    setPreview(svc.image ? `${BACKEND}${svc.image}` : null);
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("price", form.price);
      fd.append("category_id", form.category_id);
      if (editing) { fd.append("id", editing._id); fd.append("status", form.status); }
      if (imageFile) fd.append("image", imageFile);
      const res = editing ? await updateService(fd) : await addService(fd);
      if (res.data.success) {
        toast.success(editing ? "Service updated!" : "Service added!");
        setModal(false);
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed!");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      const res = await deleteService(id);
      if (res.data.success) { toast.success("Service deleted!"); fetchData(); }
    } catch (err) { toast.error(err.response?.data?.message || "Delete failed!"); }
  };

  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated} adminName={adminName}>
      <div className="row mb-4">
        <div className="col-12">
          <h4 className="fw-bold mb-1">Manage Services</h4>
          <p className="text-muted">Add, edit, and manage professional services.</p>
        </div>
      </div>

      <DataTable
        title="All Services"
        columns={["Image", "Name", "Category", "Price", "Status", "Actions"]}
        data={services}
        loading={loading}
        searchKeys={["name", "description", "category.name", "status"]}
        emptyMessage="No services found. Add your first service!"
        headerAction={
          <button className="btn btn-primary" onClick={openAdd}>
            <i className="bx bx-plus me-1" /> Add Service
          </button>
        }
        renderRow={(svc, idx) => (
          <tr key={svc._id}>
            <td>{idx}</td>
            <td>
              <img
                src={svc.image ? `${BACKEND}${svc.image}` : "/assets/img/avatars/1.png"}
                alt={svc.name}
                style={{ width: "48px", height: "48px", borderRadius: "8px", objectFit: "cover" }}
                onError={(e) => { e.target.src = "/assets/img/avatars/1.png"; }}
              />
            </td>
            <td>
              <strong style={{ fontSize: "14px" }}>{svc.name}</strong>
              <p className="text-muted mb-0" style={{ fontSize: "12px" }}>{svc.description?.slice(0, 40)}...</p>
            </td>
            <td><span className="badge bg-label-info">{svc.category?.name || "—"}</span></td>
            <td><strong className="text-success">₹{svc.price}</strong></td>
            <td>
              <span className={`badge ${svc.status === "Active" ? "bg-label-success" : "bg-label-danger"}`}>
                {svc.status}
              </span>
            </td>
            <td>
              <div className="d-flex gap-1">
                <button className="btn btn-sm btn-outline-primary" onClick={() => openEdit(svc)}><i className="bx bx-edit" /></button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(svc._id)}><i className="bx bx-trash" /></button>
              </div>
            </td>
          </tr>
        )}
      />

      {modal && (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editing ? "Edit Service" : "Add Service"}</h5>
                <button type="button" className="btn-close" onClick={() => setModal(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-12 text-center">
                      <div style={{ position: "relative", display: "inline-block" }}>
                        <img
                          src={preview || "/assets/img/avatars/1.png"}
                          alt="Preview"
                          style={{ width: "100px", height: "100px", borderRadius: "10px", objectFit: "cover", border: "2px dashed #4caf50" }}
                          onError={(e) => { e.target.src = "/assets/img/avatars/1.png"; }}
                        />
                        <label htmlFor="svc-img" style={{ position: "absolute", bottom: "-8px", right: "-8px", background: "#4caf50", color: "#fff", borderRadius: "50%", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "14px" }}>
                          <i className="bx bx-camera" />
                          <input id="svc-img" type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files[0]; if (f) { setImageFile(f); setPreview(URL.createObjectURL(f)); } }} />
                        </label>
                      </div>
                      <p className="text-muted mt-2" style={{ fontSize: "12px" }}>Upload service image</p>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Service Name <span className="text-danger">*</span></label>
                      <input type="text" className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Pipe Repair" required />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Price (₹) <span className="text-danger">*</span></label>
                      <input type="number" className="form-control" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="999" min="0" required />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Category <span className="text-danger">*</span></label>
                      <select className="form-select" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} required>
                        <option value="">Select category</option>
                        {categories.map((c) => (
                          <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    {editing && (
                      <div className="col-md-6">
                        <label className="form-label">Status</label>
                        <select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                    )}

                    <div className="col-12">
                      <label className="form-label">Description <span className="text-danger">*</span></label>
                      <textarea className="form-control" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe this service in detail" required />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? <><span className="spinner-border spinner-border-sm me-1" />{editing ? "Updating..." : "Adding..."}</> : (editing ? "Update Service" : "Add Service")}
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
