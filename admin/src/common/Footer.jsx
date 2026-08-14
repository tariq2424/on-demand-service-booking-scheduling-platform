import React from "react";

export default function Footer() {
  return (
    <footer className="content-footer footer bg-footer-theme">
      <div className="container-xxl">
        <div className="footer-container d-flex align-items-center justify-content-between py-4 flex-md-row flex-column">
          <div className="text-body mb-2 mb-md-0">
            © {new Date().getFullYear()} <strong>Home Service</strong> Admin Panel. All rights reserved.
          </div>
          <div className="d-none d-lg-inline-block">
            <span className="text-muted">Built with </span>
            <span style={{ color: "#4caf50" }}>♥</span>
            <span className="text-muted"> by Home Service Team</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
