import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function AdminLayout({
  children,
  setIsAuthenticated,
  adminName,
}) {
  return (
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        <Sidebar setIsAuthenticated={setIsAuthenticated} />
        <div className="layout-page">
          <Navbar adminName={adminName} />
          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              {children}
            </div>
            <Footer />
            <div className="content-backdrop fade" />
          </div>
        </div>
      </div>
      <div className="layout-overlay layout-menu-toggle" />
      <div className="drag-target" />
    </div>
  );
}
