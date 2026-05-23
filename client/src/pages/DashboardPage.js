import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import {
  FiBookOpen, FiAward, FiDownload,
   FiTrendingUp, FiArrowRight
} from 'react-icons/fi';
import './DashboardPage.css';

// Stats card component
const StatCard = ({ icon, label, value, color }) => (
  <div className="stat-card">
    <div className="stat-icon" style={{ background: color }}>
      {icon}
    </div>
    <div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  </div>
);

// Quick action card component
const ActionCard = ({ to, icon, title, desc, tag }) => (
  <Link to={to} className="action-card">
    <div className="action-top">
      <div className="action-icon">{icon}</div>
      {tag && <span className="action-tag">{tag}</span>}
    </div>
    <h3 className="action-title">{title}</h3>
    <p className="action-desc">{desc}</p>
    <div className="action-arrow">
      Explore <FiArrowRight size={14} />
    </div>
  </Link>
);

export default function DashboardPage() {
  const { user } = useAuth();

  // Get greeting based on time
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good Morning' :
    hour < 17 ? 'Good Afternoon' : 'Good Evening';

  const stats = [
    {
      icon: <FiBookOpen size={20} />,
      label: 'PYQ Papers',
      value: '120+',
      color: 'rgba(59,130,246,0.15)'
    },
    {
      icon: <FiAward size={20} />,
      label: 'GATE Papers',
      value: '30+',
      color: 'rgba(16,185,129,0.15)'
    },
    {
      icon: <FiDownload size={20} />,
      label: 'Free Downloads',
      value: '∞',
      color: 'rgba(245,158,11,0.15)'
    },
    {
      icon: <FiTrendingUp size={20} />,
      label: 'Practice Tests',
      value: '50+',
      color: 'rgba(139,92,246,0.15)'
    },
  ];

  const actions = [
    {
      to: '/papers',
      icon: <FiBookOpen size={28} />,
      title: 'PYQ Papers',
      desc: 'Access previous year question papers for ENTC department — from 1st year to final year.',
      tag: 'DBATU'
    },
    {
      to: '/gate',
      icon: <FiAward size={28} />,
      title: 'GATE Preparation',
      desc: 'Practice GATE ECE previous year papers with timed tests and instant result analysis.',
      tag: 'GATE ECE'
    },
  ];

  const recentPapers = [
    { name: 'Digital Electronics — 2023', year: '3rd Year', sem: 'Sem 5' },
    { name: 'Analog Circuits — 2023',     year: '2nd Year', sem: 'Sem 4' },
    { name: 'Signals & Systems — 2022',   year: '3rd Year', sem: 'Sem 5' },
    { name: 'VLSI Design — 2023',         year: '4th Year', sem: 'Sem 7' },
  ];

  return (
    <div className="dashboard-wrapper">
      <Navbar />

      <main className="dashboard-main">

        {/* Hero / Welcome banner */}
        <section className="welcome-banner">
          <div className="welcome-text">
            <p className="greeting">{greeting} 👋</p>
            <h1 className="welcome-name">{user?.name}</h1>
            <p className="welcome-sub">
              Ready to study? Access all your ENTC question papers
              and GATE prep material in one place.
            </p>
          </div>
          <div className="welcome-badge">
            <span>🎓</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>ENTC Department</div>
              <div style={{ color: '#8b9ec7', fontSize: '0.82rem' }}>DBATU University</div>
            </div>
          </div>
        </section>

        {/* Stats row */}
        <section className="stats-row">
          {stats.map((s, i) => (
            <StatCard key={i} {...s} />
          ))}
        </section>

        {/* Quick action cards */}
        <section>
          <h2 className="section-title">Quick Access</h2>
          <div className="actions-grid">
            {actions.map((a, i) => (
              <ActionCard key={i} {...a} />
            ))}
          </div>
        </section>

        {/* Recent papers */}
        <section>
          <h2 className="section-title">Recently Added Papers</h2>
          <div className="recent-list">
            {recentPapers.map((p, i) => (
              <Link to="/papers" key={i} className="recent-item">
                <div className="recent-left">
                  <div className="recent-dot" />
                  <div>
                    <div className="recent-name">{p.name}</div>
                    <div className="recent-meta">{p.year} • {p.sem}</div>
                  </div>
                </div>
                <div className="recent-action">
                  <FiDownload size={15} /> View
                </div>
              </Link>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}