import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminLayout from "../common/AdminLayout";
import DataTable from "../common/DataTable";
import { getAdminCategories, addCategory, updateCategory, deleteCategory } from "../services/api";

const BACKEND = "http://localhost:8000";
const emptyForm = { name: "", description: "", status: "Active" };

export default function ManageCategories({ setIsAuthenticated, adminName }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null); // null = add, object = edit
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAdminCategories();
      setCategories(res.data.data || []);
    } catch { toast.error("Failed to load categories"); }
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

  const openEdit = (cat) => {
    setEditing(cat);
    setForm({ name: cat.name, description: cat.description, status: cat.status });
    setImageFile(null);
    setPreview(cat.image ? `${BACKEND}${cat.image}` : null);
    setModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) { setImageFile(file); setPreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      if (editing) {
        fd.append("id", editing._id);
        fd.append("status", form.status);
      }
      if (imageFile) fd.append("image", imageFile);

      const res = editing ? await updateCategory(fd) : await addCategory(fd);
      if (res.data.success) {
        toast.success(editing ? "Category updated!" : "Category added!");
        setModal(false);
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed!");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category? This cannot be undone.")) return;
    try {
      const res = await deleteCategory(id);
      if (res.data.success) { toast.success("Category deleted!"); fetchData(); }
    } catch (err) { toast.error(err.response?.data?.message || "Delete failed!"); }
  };

  const statusBadge = (status) => (
    <span className={`badge ${status === "Active" ? "bg-label-success" : "bg-label-danger"}`}>
      {status}
    </span>
  );

  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated} adminName={adminName}>
      <div className="row mb-4">
        <div className="col-12">
          <h4 className="fw-bold mb-1">Manage Categories</h4>
          <p className="text-muted">Add, edit, and manage service categories.</p>
        </div>
      </div>

      <DataTable
        title="All Categories"
        columns={["Image", "Name", "Description", "Status", "Created", "Actions"]}
        data={categories}
        loading={loading}
        searchKeys={["name", "description", "status"]}
        emptyMessage="No categories found. Add your first category!"
        headerAction={
          <button className="btn btn-primary" onClick={openAdd}>
            <i className="bx bx-plus me-1" /> Add Category
          </button>
        }
        renderRow={(cat, idx) => (
          <tr key={cat._id}>
            <td>{idx}</td>
            <td>
              <img
                src={cat.image ? `${BACKEND}${cat.image}` : "/assets/img/avatars/1.png"}
                alt={cat.name}
                style={{ width: "48px", height: "48px", borderRadius: "8px", objectFit: "cover" }}
                onError={(e) => { e.target.src = "/assets/img/avatars/1.png"; }}
              />
            </td>
            <td><strong>{cat.name}</strong></td>
            <td><span className="text-muted" style={{ fontSize: "13px" }}>{cat.description?.slice(0, 50)}...</span></td>
            <td>{statusBadge(cat.status)}</td>
            <td><span className="text-muted" style={{ fontSize: "13px" }}>{cat.created_at ? new Date(cat.created_at).toLocaleDateString("en-IN") : "—"}</span></td>
            <td>
              <div className="d-flex gap-1">
                <button className="btn btn-sm btn-outline-primary" onClick={() => openEdit(cat)} title="Edit">
                  <i className="bx bx-edit" />
                </button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(cat._id)} title="Delete">
                  <i className="bx bx-trash" />
                </button>
              </div>
            </td>
          </tr>
        )}
      />

      {/* Modal */}
      {modal && (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editing ? "Edit Category" : "Add Category"}</h5>
                <button type="button" className="btn-close" onClick={() => setModal(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    {/* Image upload */}
                    <div className="col-12 text-center">
                      <div style={{ position: "relative", display: "inline-block" }}>
                        <img
                          src={preview || "/assets/img/avatars/1.png"}
                          alt="Preview"
                          style={{ width: "100px", height: "100px", borderRadius: "10px", objectFit: "cover", border: "2px dashed #4caf50" }}
                          onError={(e) => { e.target.src = "/assets/img/avatars/1.png"; }}
                        />
                        <label htmlFor="cat-img" style={{ position: "absolute", bottom: "-8px", right: "-8px", background: "#4caf50", color: "#fff", borderRadius: "50%", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "14px" }}>
                          <i className="bx bx-camera" />
                          <input id="cat-img" type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageChange} />
                        </label>
                      </div>
                      <p className="text-muted mt-2" style={{ fontSize: "12px" }}>Click the camera icon to upload an image</p>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Category Name <span className="text-danger">*</span></label>
                      <input type="text" className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Plumbing Services" required />
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
                      <textarea className="form-control" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description of this category" required />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? <><span className="spinner-border spinner-border-sm me-1" />{editing ? "Updating..." : "Adding..."}</> : (editing ? "Update Category" : "Add Category")}
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
