import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { changePassword } from "../services/api";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1=email, 2=reset
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");
    setStep(2);
    toast.info("Enter your new password below");
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match!");
    if (newPassword.length < 6)
      return toast.error("Password must be at least 6 characters");
    setLoading(true);
    try {
      const res = await changePassword({ email, newPassword });
      if (res.data.success) {
        toast.success("Password changed successfully! Please login.");
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Reset failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w3l-forms-17">
      <div id="forms-17_sur">
        <div className="wrapper">
          <div className="forms-17-top">
            <div className="forms-17-text">
              <div className="top">
                <span className="fa fa-lock"></span>
                <h4>Forgot Password?</h4>
                <p>Reset your account password</p>
              </div>
              <ul className="bottom-list">
                <li>
                  <span className="fa fa-check"></span> Enter your registered
                  email address.
                </li>
                <li>
                  <span className="fa fa-check"></span> Set a strong new
                  password for your account.
                </li>
                <li>
                  <span className="fa fa-check"></span> Login immediately with
                  your new credentials.
                </li>
              </ul>
            </div>

            <div className="forms-17-form">
              <div className="form-17-tp">
                <h6>
                  {step === 1 ? "Enter Email" : "Reset Password"}
                </h6>

                {step === 1 ? (
                  <form onSubmit={handleEmailSubmit} className="signin-form">
                    <div className="form-input">
                      <input
                        type="email"
                        placeholder="Your registered email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="align-left-right">
                      <button className="btn" type="submit">
                        Continue <span className="fa fa-arrow-right"></span>
                      </button>
                    </div>
                    <div className="bottom-login">
                      <p>
                        Remember password? <Link to="/login">Login</Link>
                      </p>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleReset} className="signin-form">
                    <p
                      style={{
                        marginBottom: "12px",
                        color: "#555",
                        fontSize: "13px",
                      }}
                    >
                      Resetting for: <strong>{email}</strong>
                    </p>
                    <div className="form-input">
                      <input
                        type="password"
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-input">
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="align-left-right">
                      <button className="btn" type="submit" disabled={loading}>
                        {loading ? "Resetting..." : "Reset Password"}
                      </button>
                    </div>
                    <div className="bottom-login">
                      <p>
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#4caf50",
                            cursor: "pointer",
                            padding: 0,
                            fontSize: "14px",
                          }}
                        >
                          ← Change email
                        </button>
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

          <div className="btn btn-home text-center">
            <Link to="/">
              Back to home <span className="fa fa-long-arrow-right"></span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
