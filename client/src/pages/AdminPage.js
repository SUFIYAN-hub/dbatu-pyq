import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { FiBookOpen, FiAward, FiUsers } from 'react-icons/fi';
import AdminPapers from '../components/Admin/AdminPapers';
import AdminGate from '../components/Admin/AdminGate';
import AdminUsers from '../components/Admin/AdminUsers';
import './AdminPage.css';

const TABS = [
  { id: 'papers', label: 'PYQ Papers', icon: <FiBookOpen size={18} /> },
  { id: 'gate',   label: 'GATE Questions', icon: <FiAward size={18} /> },
  { id: 'users',  label: 'Users', icon: <FiUsers size={18} /> },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('papers');

  return (
    <div className="admin-wrapper">
      <Navbar />
      <main className="admin-main">

        {/* Header */}
        <div className="admin-header">
          <div>
            <h1 className="admin-title">⚙️ Admin Panel</h1>
            <p className="admin-sub">Manage papers, GATE questions and users</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="admin-content">
          {activeTab === 'papers' && <AdminPapers />}
          {activeTab === 'gate'   && <AdminGate />}
          {activeTab === 'users'  && <AdminUsers />}
        </div>

      </main>
    </div>
  );
}