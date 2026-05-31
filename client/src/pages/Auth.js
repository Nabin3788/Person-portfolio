import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Home/Home.css";

const Auth = () => {
  const [tabs, setTabs] = useState("login");
  const [accountType, setAccountType] = useState("user");
  const [adminAvailable, setAdminAvailable] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [formError, setFormError] = useState(null);
  const { user, loading, login, register } = useContext(AuthContext);

  const apiUrl = process.env.REACT_APP_API_URL || "";
  const API_BASE = apiUrl.replace(/\/$/, "");

  useEffect(() => {
    const checkAdminAvailability = async () => {
      try {
        const response = await fetch(`${API_BASE}/auth/admin-available`);
        const data = await response.json();
        setAdminAvailable(data.adminAvailable);
      } catch (_) {
        setAdminAvailable(false);
      }
    };

    checkAdminAvailability();
  }, [API_BASE]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError(null);

    if (tabs === "login") {
      const result = await login(formData.email, formData.password);
      if (!result.success) {
        setFormError(result.error);
      }
      return;
    }

    if (!formData.name || !formData.email || !formData.password) {
      setFormError("Name, email, and password are required.");
      return;
    }

    if (formData.password.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }

    if (accountType === "admin" && !adminAvailable) {
      setFormError("Admin has already been registered. Choose user instead.");
      return;
    }

    const result = await register(
      formData.name,
      formData.email,
      formData.password,
      accountType,
    );
    if (!result.success) {
      setFormError(result.error);
    }
  };

  if (loading) {
    return (
      <main className="home-page">
        <p className="hero-copy">Loading authentication state...</p>
      </main>
    );
  }

  if (user) {
    return (
      <Navigate to={user.role === "admin" ? "/admin" : "/contact"} replace />
    );
  }

  return (
    <main className="home-page">
      <section className="hero-panel auth-panel">
        <div className="hero-background" />
        <div className="hero-content">
          <span className="eyebrow">Secure Portfolio Access</span>
          <h1>
            {tabs === "login"
              ? "Sign into your account"
              : "Create a new account"}
          </h1>
          <p className="hero-copy">
            Use your email and password to log in or register. Only one admin
            account may be created.
          </p>

          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab ${tabs === "login" ? "active" : ""}`}
              onClick={() => setTabs("login")}
            >
              Log in
            </button>
            <button
              type="button"
              className={`auth-tab ${tabs === "register" ? "active" : ""}`}
              onClick={() => setTabs("register")}
            >
              Register
            </button>
          </div>

          {tabs === "register" && (
            <div className="auth-tabs" style={{ marginTop: "16px" }}>
              <button
                type="button"
                className={`auth-tab ${accountType === "user" ? "active" : ""}`}
                onClick={() => setAccountType("user")}
              >
                User
              </button>
              <button
                type="button"
                className={`auth-tab ${accountType === "admin" ? "active" : ""}`}
                onClick={() => setAccountType("admin")}
              >
                Admin
              </button>
            </div>
          )}

          {formError && <p className="form-error">{formError}</p>}

          <form className="contact-form" onSubmit={handleSubmit}>
            {tabs === "register" && (
              <div className="form-group">
                <label htmlFor="name">Full name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-hire">
              {tabs === "login" ? "Sign in" : `Register as ${accountType}`}
            </button>
          </form>

          {tabs === "register" && (
            <p className="hero-copy" style={{ marginTop: "16px" }}>
              {accountType === "admin"
                ? adminAvailable
                  ? "Register the first admin account. After admin creation, all other users should use normal registration."
                  : "Admin is already registered. Please choose the user role instead."
                : "Register as a user to send secure contact requests and receive replies from admin."}
            </p>
          )}

          {tabs === "login" && (
            <p className="hero-copy" style={{ marginTop: "16px" }}>
              Login with the email and password you registered. Admins will be
              redirected to the admin dashboard.
            </p>
          )}
        </div>
      </section>
    </main>
  );
};

export default Auth;
