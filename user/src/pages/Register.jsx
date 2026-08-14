import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signup } from "../services/api";

export default function Register() {
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signup(data);
      if (res.data.success) {
        toast.success("Registered successfully! Please login.");
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w3l-forms-17">
      <div id="forms-17_sur">
        <div className="wrapper">
          <div className="forms-17-top">
            {/* Left info panel */}
            <div className="forms-17-text">
              <div className="top">
                <span className="fa fa-user"></span>
                <h4>Register here</h4>
                <p>Create your account</p>
              </div>
              <ul className="bottom-list">
                <li>
                  <span className="fa fa-check"></span> Get access to 100+
                  professional home services.
                </li>
                <li>
                  <span className="fa fa-check"></span> Book, reschedule or
                  cancel appointments anytime.
                </li>
                <li>
                  <span className="fa fa-check"></span> Pay securely and track
                  your service history.
                </li>
              </ul>
            </div>

            {/* Right form panel */}
            <div className="forms-17-form">
              <div className="form-17-tp">
                <h6>Register</h6>
                <form onSubmit={handleSubmit} className="signin-form">
                  <div className="form-input">
                    <input
                      type="text"
                      name="name"
                      placeholder="Your full name"
                      value={data.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-input">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email address"
                      value={data.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-input">
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone number"
                      value={data.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-input">
                    <input
                      type="text"
                      name="address"
                      placeholder="Your address"
                      value={data.address}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-input">
                    <input
                      type="password"
                      name="password"
                      placeholder="Create password"
                      value={data.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="align-left-right margin-create">
                    <button className="btn" type="submit" disabled={loading}>
                      {loading ? "Creating..." : "Create Account"}
                    </button>
                  </div>
                  <div className="bottom-login">
                    <p>
                      Already a customer? <Link to="/login">Login</Link>
                    </p>
                  </div>
                </form>
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
