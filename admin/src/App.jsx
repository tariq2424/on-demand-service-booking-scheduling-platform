import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import checkSession from "./auth/authService";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ManageCategories from "./pages/ManageCategories";
import ManageServices from "./pages/ManageServices";
import ManageBookings from "./pages/ManageBookings";
import ManageUsers from "./pages/ManageUsers";
import ManagePayments from "./pages/ManagePayments";
import ManageFeedbacks from "./pages/ManageFeedbacks";
import AdminProfile from "./pages/AdminProfile";

function PageLoader() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f9",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <div
        className="spinner-border text-primary"
        style={{ width: "48px", height: "48px" }}
      />
      <p style={{ color: "#697a8d", fontSize: "16px" }}>
        Loading Admin Panel...
      </p>
    </div>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      try {
        const result = await checkSession();
        if (result.isAuth) {
          setIsAuthenticated(true);
          setAdminName(result.session?.name || "Admin");
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, []);

  if (loading) return <PageLoader />;

  // Shared props passed down to every admin page
  const sharedProps = { setIsAuthenticated, adminName };

  // Helper: Protected route wrapper
  const Protected = ({ children }) =>
    isAuthenticated ? children : <Navigate to="/login" replace />;

  // Helper: Guest-only route
  const GuestOnly = ({ children }) =>
    !isAuthenticated ? children : <Navigate to="/" replace />;

  return (
    <>
      <ToastContainer stacked autoClose={2500} position="top-right" />
      <BrowserRouter>
        <Routes>
          {/* Guest only */}
          <Route
            path="/login"
            element={
              <GuestOnly>
                <Login
                  setIsAuthenticated={(v) => {
                    setIsAuthenticated(v);
                  }}
                />
              </GuestOnly>
            }
          />

          {/* Protected admin routes */}
          <Route
            path="/"
            element={
              <Protected>
                <Dashboard {...sharedProps} />
              </Protected>
            }
          />
          <Route
            path="/manage-categories"
            element={
              <Protected>
                <ManageCategories {...sharedProps} />
              </Protected>
            }
          />
          <Route
            path="/manage-services"
            element={
              <Protected>
                <ManageServices {...sharedProps} />
              </Protected>
            }
          />
          <Route
            path="/manage-bookings"
            element={
              <Protected>
                <ManageBookings {...sharedProps} />
              </Protected>
            }
          />
          <Route
            path="/manage-users"
            element={
              <Protected>
                <ManageUsers {...sharedProps} />
              </Protected>
            }
          />
          <Route
            path="/manage-payments"
            element={
              <Protected>
                <ManagePayments {...sharedProps} />
              </Protected>
            }
          />
          <Route
            path="/manage-feedbacks"
            element={
              <Protected>
                <ManageFeedbacks {...sharedProps} />
              </Protected>
            }
          />
          <Route
            path="/profile"
            element={
              <Protected>
                <AdminProfile {...sharedProps} />
              </Protected>
            }
          />

          {/* Fallback */}
          <Route
            path="*"
            element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}
