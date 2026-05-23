import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCheck, FiX } from 'react-icons/fi';
import { HiAcademicCap } from 'react-icons/hi';
import './AuthPages.css';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate     = useNavigate();

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: ''
  });
  const [errors, setErrors]     = useState({});
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [loading, setLoading]   = useState(false);

  // Password strength rules
  const rules = [
    { label: 'At least 6 characters', test: (p) => p.length >= 6 },
    { label: 'One uppercase letter',  test: (p) => /[A-Z]/.test(p) },
    { label: 'One number',            test: (p) => /[0-9]/.test(p) },
  ];

  // ── Frontend validation ──────────────────────────────
  const validate = () => {
    const e = {};

    if (!form.name.trim())
      e.name = 'Name is required';
    else if (form.name.trim().length < 2)
      e.name = 'Name must be at least 2 characters';

    if (!form.email.trim())
      e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      e.email = 'Enter a valid email address';

    if (!form.password)
      e.password = 'Password is required';
    else if (form.password.length < 6)
      e.password = 'Password must be at least 6 characters';
    else if (!/[A-Z]/.test(form.password))
      e.password = 'Password must have at least one uppercase letter';
    else if (!/[0-9]/.test(form.password))
      e.password = 'Password must have at least one number';

    if (!form.confirmPassword)
      e.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword)
      e.confirmPassword = 'Passwords do not match';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name])
      setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const user = await register(
        form.name, form.email, form.password, form.confirmPassword
      );
      toast.success(`Account created! Welcome, ${user.name.split(' ')[0]}! 🎉`);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      <div className="auth-card fadeUp" style={{ maxWidth: 460 }}>
        <div className="auth-logo">
          <HiAcademicCap size={36} />
          <span>DBATU <span className="text-accent">PYQ</span></span>
        </div>

        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join thousands of DBATU students</p>

        <form onSubmit={handleSubmit} noValidate>

          {/* Name */}
          <div className="form-group">
            <label>Full Name</label>
            <div className={`input-wrap ${errors.name ? 'error' : ''}`}>
              <FiUser className="input-icon" />
              <input
                type="text"
                name="name"
                placeholder="Your full name"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            {errors.name && <span className="error-msg">{errors.name}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email Address</label>
            <div className={`input-wrap ${errors.email ? 'error' : ''}`}>
              <FiMail className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            {errors.email && <span className="error-msg">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>
            <div className={`input-wrap ${errors.password ? 'error' : ''}`}>
              <FiLock className="input-icon" />
              <input
                type={showPass ? 'text' : 'password'}
                name="password"
                placeholder="Create a strong password"
                value={form.password}
                onChange={handleChange}
              />
              <button type="button" className="toggle-pass"
                onClick={() => setShowPass(!showPass)}>
                {showPass ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password && <span className="error-msg">{errors.password}</span>}

            {/* Password strength indicator */}
            {form.password && (
              <div className="password-rules">
                {rules.map((rule, i) => (
                  <div key={i} className={`rule ${rule.test(form.password) ? 'pass' : 'fail'}`}>
                    {rule.test(form.password) ? <FiCheck /> : <FiX />}
                    <span>{rule.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label>Confirm Password</label>
            <div className={`input-wrap ${errors.confirmPassword ? 'error' : ''}`}>
              <FiLock className="input-icon" />
              <input
                type={showConf ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Repeat your password"
                value={form.confirmPassword}
                onChange={handleChange}
              />
              <button type="button" className="toggle-pass"
                onClick={() => setShowConf(!showConf)}>
                {showConf ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.confirmPassword &&
              <span className="error-msg">{errors.confirmPassword}</span>}
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? <span className="btn-spinner" /> : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login →</Link>
        </p>
      </div>
    </div>
  );
}