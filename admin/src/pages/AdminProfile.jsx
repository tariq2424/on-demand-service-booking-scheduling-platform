import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminLayout from "../common/AdminLayout";
import { getProfile, updateProfile, changePassword } from "../services/api";

const BACKEND = "http://localhost:8000";

export default function AdminProfile({ setIsAuthenticated, adminName }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPass, setChangingPass] = useState(false);
  const [activeTab, setActiveTab] = useState("info"); // "info" | "password"

  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [passForm, setPassForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      const data = res.data.data;
      setProfile(data);
      setForm({ name: data.name || "", phone: data.phone || "", address: data.address || "" });
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) { setImageFile(file); setPreview(URL.createObjectURL(file)); }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("phone", form.phone);
      fd.append("address", form.address);
      if (imageFile) fd.append("profile_image", imageFile);
      const res = await updateProfile(fd);
      if (res.data.success) {
        toast.success("Profile updated successfully!");
        setImageFile(null);
        fetchProfile();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed!");
    } finally { setSaving(false); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) {
      return toast.error("Passwords do not match!");
    }
    if (passForm.newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters!");
    }
    setChangingPass(true);
    try {
      const res = await changePassword({ email: profile.email, newPassword: passForm.newPassword });
      if (res.data.success) {
        toast.success("Password changed successfully!");
        setPassForm({ newPassword: "", confirmPassword: "" });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Password change failed!");
    } finally { setChangingPass(false); }
  };

  const avatarSrc = preview
    ? preview
    : profile?.profile_image
    ? `${BACKEND}${profile.profile_image}`
    : null;

  if (loading) {
    return (
      <AdminLayout setIsAuthenticated={setIsAuthenticated} adminName={adminName}>
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
          <p className="mt-3 text-muted">Loading profile...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated} adminName={adminName}>
      {/* Page Header */}
      <div className="row mb-4">
        <div className="col-12">
          <h4 className="fw-bold mb-1">Admin Profile</h4>
          <p className="text-muted">Manage your account information and security settings.</p>
        </div>
      </div>

      <div className="row g-4">
        {/* ── Left: Avatar Card ── */}
        <div className="col-xl-4 col-lg-5">
          <div className="card">
            <div className="card-body text-center pt-5 pb-4">
              {/* Avatar */}
              <div style={{ position: "relative", display: "inline-block", marginBottom: "16px" }}>
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt="Admin"
                    style={{
                      width: "100px", height: "100px", borderRadius: "50%",
                      objectFit: "cover", border: "4px solid #4caf50",
                    }}
                  />
                ) : (
                  <div style={{
                    width: "100px", height: "100px", borderRadius: "50%",
                    background: "linear-gradient(135deg,#4caf50,#2e7d32)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "40px", color: "#fff", fontWeight: "700", margin: "0 auto",
                  }}>
                    {profile?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <label
                  htmlFor="admin-avatar"
                  style={{
                    position: "absolute", bottom: "2px", right: "2px",
                    width: "28px", height: "28px", borderRadius: "50%",
                    background: "#696cff", color: "#fff", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    cursor: "pointer", fontSize: "13px", border: "2px solid #fff",
                  }}
                  title="Change photo"
                >
                  <i className="bx bx-camera" />
                  <input
                    id="admin-avatar"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              <h5 className="mb-1 fw-bold">{profile?.name}</h5>
              <p className="text-muted mb-1" style={{ fontSize: "13px" }}>{profile?.email}</p>
              <span className="badge bg-label-success mb-3">Administrator</span>

              <hr />

              {/* Info list */}
              <div className="text-start px-2">
                {[
                  { icon: "bx-phone", label: "Phone", value: profile?.phone },
                  { icon: "bx-map", label: "Address", value: profile?.address },
                  { icon: "bx-calendar", label: "Member Since", value: profile?.created_at ? new Date(profile.created_at).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : "—" },
                  { icon: "bx-shield-check", label: "Status", value: profile?.status },
                ].map((item) => (
                  <div key={item.label} className="d-flex align-items-start gap-2 mb-3">
                    <i className={`bx ${item.icon} mt-1`} style={{ color: "#696cff", fontSize: "16px", width: "18px", flexShrink: 0 }} />
                    <div>
                      <p className="text-muted mb-0" style={{ fontSize: "11px", lineHeight: 1 }}>{item.label}</p>
                      <p className="mb-0 fw-semibold" style={{ fontSize: "13px" }}>{item.value || "—"}</p>
                    </div>
                  </div>
                ))}
              </div>

              {imageFile && (
                <button
                  className="btn btn-primary btn-sm w-100 mt-2"
                  onClick={handleSaveProfile}
                  disabled={saving}
                >
                  {saving ? <><span className="spinner-border spinner-border-sm me-1" />Saving...</> : "Save New Photo"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Right: Tabs ── */}
        <div className="col-xl-8 col-lg-7">
          <div className="card">
            {/* Tab Nav */}
            <div className="card-header p-0 border-bottom">
              <ul className="nav nav-tabs card-header-" style={{ paddingLeft: "20px" }}>
                {[
                  { key: "info", icon: "bx-user", label: "Account Info" },
                  { key: "password", icon: "bx-lock-alt", label: "Change Password" },
                ].map((tab) => (
                  <li className="nav-item" key={tab.key}>
                    <button
                      className={`nav-link ${activeTab === tab.key ? "active" : ""}`}
                      onClick={() => setActiveTab(tab.key)}
                      style={{ border: "none", background: "none", padding: "14px 20px" }}
                    >
                      <i className={`bx ${tab.icon} me-1`} />
                      {tab.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card-body p-4">

              {/* ── Account Info Tab ── */}
              {activeTab === "info" && (
                <form onSubmit={handleSaveProfile}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Full Name <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Your full name"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        value={profile?.email || ""}
                        disabled
                        style={{ background: "#f8f9fa", color: "#aaa" }}
                      />
                      <small className="text-muted">Email cannot be changed</small>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="Your phone number"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Role</label>
                      <input
                        type="text"
                        className="form-control"
                        value="Administrator"
                        disabled
                        style={{ background: "#f8f9fa", color: "#aaa" }}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">Address</label>
                      <textarea
                        className="form-control"
                        rows={2}
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        placeholder="Your address"
                      />
                    </div>
                  </div>

                  <div className="mt-4 d-flex gap-2">
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                      {saving
                        ? <><span className="spinner-border spinner-border-sm me-1" />Saving...</>
                        : <><i className="bx bx-save me-1" />Save Changes</>
                      }
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        setForm({ name: profile?.name || "", phone: profile?.phone || "", address: profile?.address || "" });
                        setPreview(null);
                        setImageFile(null);
                      }}
                    >
                      Reset
                    </button>
                  </div>
                </form>
              )}

              {/* ── Change Password Tab ── */}
              {activeTab === "password" && (
                <form onSubmit={handleChangePassword}>
                  <div className="alert alert-warning d-flex gap-2 mb-4" style={{ fontSize: "13px" }}>
                    <i className="bx bx-info-circle mt-1" style={{ flexShrink: 0 }} />
                    <span>Make sure your new password is at least 6 characters long and is different from your current one.</span>
                  </div>

                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">New Password <span className="text-danger">*</span></label>
                      <div className="input-group">
                        <input
                          type="password"
                          className="form-control"
                          value={passForm.newPassword}
                          onChange={(e) => setPassForm({ ...passForm, newPassword: e.target.value })}
                          placeholder="Enter new password"
                          minLength={6}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-12">
                      <label className="form-label">Confirm New Password <span className="text-danger">*</span></label>
                      <input
                        type="password"
                        className="form-control"
                        value={passForm.confirmPassword}
                        onChange={(e) => setPassForm({ ...passForm, confirmPassword: e.target.value })}
                        placeholder="Confirm new password"
                        required
                      />
                      {passForm.confirmPassword && passForm.newPassword !== passForm.confirmPassword && (
                        <small className="text-danger mt-1 d-block">
                          <i className="bx bx-x me-1" />Passwords do not match
                        </small>
                      )}
                      {passForm.confirmPassword && passForm.newPassword === passForm.confirmPassword && passForm.newPassword.length >= 6 && (
                        <small className="text-success mt-1 d-block">
                          <i className="bx bx-check me-1" />Passwords match
                        </small>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={changingPass || passForm.newPassword !== passForm.confirmPassword || passForm.newPassword.length < 6}
                    >
                      {changingPass
                        ? <><span className="spinner-border spinner-border-sm me-1" />Updating...</>
                        : <><i className="bx bx-lock-open-alt me-1" />Update Password</>
                      }
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
