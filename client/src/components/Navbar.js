import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  FiMenu, FiX, FiLogOut, FiHome,
  FiBookOpen, FiAward, FiSettings
} from 'react-icons/fi';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location          = useLocation();
  const navigate          = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: <FiHome /> },
    { to: '/papers',    label: 'PYQ Papers', icon: <FiBookOpen /> },
    { to: '/gate',      label: 'GATE Prep',  icon: <FiAward /> },
    ...(user?.role === 'admin'
      ? [{ to: '/admin', label: 'Admin Panel', icon: <FiSettings /> }]
      : []),
  ];

  return (
    <nav className="navbar">
      <div className="navbar-inner">

        {/* Logo */}
        <Link to="/dashboard" className="navbar-logo">
          🎓 DBATU<span>PYQ</span>
        </Link>

        {/* Desktop links */}
        <div className="navbar-links">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="navbar-right">
          <div className="user-chip">
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <span className="user-name">{user?.name?.split(' ')[0]}</span>
              {user?.role === 'admin' &&
                <span className="admin-badge">Admin</span>}
            </div>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut size={16} />
            <span>Logout</span>
          </button>

          {/* Mobile hamburger */}
          <button
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="mobile-menu">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`mobile-link ${location.pathname === link.to ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.icon} {link.label}
            </Link>
          ))}
          <button className="mobile-logout" onClick={handleLogout}>
            <FiLogOut size={15} /> Logout
          </button>
        </div>
      )}
    </nav>
  );
}