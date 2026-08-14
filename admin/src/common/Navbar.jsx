import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logout } from "../services/api";
import Cookies from "js-cookie";

export default function Navbar({ setIsAuthenticated, adminName }) {
  const navigate = useNavigate();

  const toggleSidebar = () => {
    document.documentElement.classList.toggle("layout-menu-expanded");
  };

  const handleLogout = async () => {
    try {
      await logout();
      Cookies.remove("token");
      setIsAuthenticated(false);
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch {
      toast.error("Logout failed!");
    }
  };

  // Theme toggle
  useEffect(() => {
    const themeButtons = document.querySelectorAll("[data-bs-theme-value]");
    const htmlEl = document.documentElement;
    const saved = localStorage.getItem("admin-theme");
    if (saved) htmlEl.setAttribute("data-bs-theme", saved);

    const handle = (e) => {
      const t = e.currentTarget.getAttribute("data-bs-theme-value");
      htmlEl.setAttribute(
        "data-bs-theme",
        t === "system"
          ? window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
          : t,
      );
      localStorage.setItem("admin-theme", t);
      themeButtons.forEach((b) => b.classList.remove("active"));
      e.currentTarget.classList.add("active");
    };
    themeButtons.forEach((b) => b.addEventListener("click", handle));
    return () =>
      themeButtons.forEach((b) => b.removeEventListener("click", handle));
  }, []);

  return (
    <nav
      className="layout-navbar container-xxl navbar-detached navbar navbar-expand-xl align-items-center bg-navbar-theme"
      id="layout-navbar"
    >
      {/* Mobile hamburger */}
      <div className="layout-menu-toggle navbar-nav align-items-xl-center me-4 me-xl-0 d-xl-none">
        <div
          className="nav-item nav-link px-0 me-xl-6"
          onClick={toggleSidebar}
          style={{ cursor: "pointer" }}
        >
          <i className="icon-base bx bx-menu icon-md" />
        </div>
      </div>

      <div
        className="navbar-nav-right d-flex align-items-center justify-content-end w-100"
        id="navbar-collapse"
      >
        <ul className="navbar-nav flex-row align-items-center ms-auto gap-2">
          {/* Theme toggle */}

          {/* Admin avatar + dropdown */}
          <li className="nav-item dropdown">
            <Link
              className="nav-link dropdown-toggle hide-arrow"
              to="/profile"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <div className="avatar avatar-online">
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#4caf50,#2e7d32)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: "700",
                    fontSize: "16px",
                  }}
                >
                  {adminName ? adminName.charAt(0).toUpperCase() : "A"}
                </div>
              </div>
            </Link>
            <ul className="dropdown-menu dropdown-menu-end m-0">
              <li>
                <div className="dropdown-item-text px-4 py-2">
                  <p className="mb-0 fw-semibold" style={{ fontSize: "14px" }}>
                    {adminName || "Admin"}
                  </p>
                  <small className="text-muted">Administrator</small>
                </div>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <Link className="dropdown-item" to="/profile">
                  <i className="bx bx-user me-2" />
                  <span>My Profile</span>
                </Link>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <div
                  className="dropdown-item"
                  onClick={handleLogout}
                  style={{ cursor: "pointer" }}
                >
                  <i className="bx bx-power-off me-2 text-danger" />
                  <span className="text-danger">Logout</span>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
}
