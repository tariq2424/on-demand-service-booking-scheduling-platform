import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { login } from "../services/api";

export default function Login({ setIsAuthenticated }) {
  const [data, setData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(data);
      if (res.data.success) {
        const role = res.data.userData?.session?.role;
        if (role !== "Admin") {
          toast.error("Access denied. Admins only.");
          return;
        }
        Cookies.set("token", res.data.token, { expires: 7, sameSite: "Lax" });
        setIsAuthenticated(true);
        toast.success("Welcome back, Admin!");
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-xxl">
      <div className="authentication-wrapper authentication-basic container-p-y">
        <div className="authentication-inner py-6">
          <div className="card">
            <div className="card-body p-6">
              {/* Logo */}
              <div className="app-brand justify-content-center mb-6">
                <a href="/" className="app-brand-link gap-2">
                  <span style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    width: "40px", height: "40px", borderRadius: "10px",
                    background: "linear-gradient(135deg,#4caf50,#2e7d32)",
                    color: "#fff", fontSize: "20px", fontWeight: "700"
                  }}>H</span>
                  <span className="app-brand-text demo fw-bold ms-2" style={{ fontSize: "20px" }}>
                    HomeService
                  </span>
                </a>
              </div>

              <h4 className="mb-1">Welcome to Admin Panel 👋</h4>
              <p className="mb-6">Please sign in to your admin account</p>

              <form onSubmit={handleSubmit}>
                {/* Email */}
                <div className="mb-6 form-floating form-floating-outline">
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    placeholder="admin@example.com"
                    value={data.email}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="email">Email Address</label>
                </div>

                {/* Password */}
                <div className="mb-6 form-password-toggle">
                  <div className="form-floating form-floating-outline">
                    <input
                      type={showPass ? "text" : "password"}
                      className="form-control"
                      id="password"
                      name="password"
                      placeholder="············"
                      value={data.password}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="password">Password</label>
                    <span
                      className="input-group-text cursor-pointer"
                      style={{
                        position: "absolute", right: "12px", top: "50%",
                        transform: "translateY(-50%)", cursor: "pointer",
                        background: "none", border: "none"
                      }}
                      onClick={() => setShowPass(!showPass)}
                    >
                      <i className={`bx ${showPass ? "bx-show" : "bx-hide"}`} style={{ fontSize: "18px", color: "#888" }} />
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary d-grid w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <><i className="bx bx-loader bx-spin me-2" />Signing in...</>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </form>

              {/* Info box */}
              <div className="mt-5 p-3 rounded" style={{ background: "#e8f5e9", border: "1px solid #c8e6c9" }}>
                <p className="mb-1" style={{ fontSize: "13px", color: "#2e7d32" }}>
                  <i className="bx bx-info-circle me-1" />
                  <strong>Admin access only.</strong> Users must login via the User Portal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
