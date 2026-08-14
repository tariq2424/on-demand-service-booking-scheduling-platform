import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../services/api";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

export default function Sidebar({ setIsAuthenticated }) {
  const location = useLocation();
  const path = location.pathname;
  const isActive = (p) => path === p;

  const navigate = useNavigate();
  const toggleSidebar = () => {
    document.documentElement.classList.remove("layout-menu-expanded");
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

  const menuItems = [
    { to: "/", icon: "bx bx-home-smile", label: "Dashboard" },
    { to: "/manage-categories", icon: "bx bx-category", label: "Categories" },
    { to: "/manage-services", icon: "bx bx-wrench", label: "Services" },
    { to: "/manage-bookings", icon: "bx bx-calendar-check", label: "Bookings" },
    { to: "/manage-users", icon: "bx bx-user", label: "Users" },
    { to: "/manage-payments", icon: "bx bx-credit-card", label: "Payments" },
    { to: "/manage-feedbacks", icon: "bx bx-star", label: "Feedbacks" },
  ];

  return (
    <aside
      id="layout-menu"
      className="layout-menu menu-vertical menu bg-menu-theme"
    >
      {/* Brand */}
      <div className="app-brand demo">
        <Link to="/" className="app-brand-link">
          <span className="app-brand-logo demo">
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "linear-gradient(135deg,#4caf50,#2e7d32)",
                color: "#fff",
                fontSize: "16px",
                fontWeight: "700",
              }}
            >
              H
            </span>
          </span>
          <span className="app-brand-text demo menu-text fw-bold ms-2">
            HomeService
          </span>
        </Link>
        <div
          className="layout-menu-toggle menu-link text-large ms-auto d-xl-none"
          onClick={toggleSidebar}
        >
          <i className="bx bx-chevron-left bx-sm d-flex align-items-center justify-content-center" />
        </div>
      </div>

      <div className="menu-inner-shadow" />

      <ul className="menu-inner py-1">
        {menuItems.map((item) => (
          <li
            key={item.to}
            className={`menu-item${isActive(item.to) ? " active" : ""}`}
          >
            <Link
              to={item.to}
              className={`menu-link${isActive(item.to) ? " active" : ""}`}
            >
              <i className={`menu-icon icon-base ${item.icon}`} />
              <div>{item.label}</div>
            </Link>
          </li>
        ))}

        {/* Divider */}
        <li className="menu-header small text-uppercase">
          <span className="menu-header-text">Account</span>
        </li>
        <li className={`menu-item${isActive("/profile") ? " active" : ""}`}>
          <Link
            to="/profile"
            className={`menu-link${isActive("/profile") ? " active" : ""}`}
          >
            <i className="menu-icon icon-base bx bx-user-circle" />
            <div>Admin Profile</div>
          </Link>
        </li>
        <li className={`menu-item`}>
          <Link onClick={handleLogout} className={`menu-link`}>
            <i className={`menu-icon icon-base bx bx-user-circle`} />
            <div>{"Logout"}</div>
          </Link>
        </li>
      </ul>
    </aside>
  );
}
