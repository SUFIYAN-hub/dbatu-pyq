import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { FiSearch, FiFilter, FiX, FiExternalLink } from 'react-icons/fi';
import './PapersPage.css';

// Filter options
const YEARS     = ['All', '1st Year', '2nd Year', '3rd Year', '4th Year'];
const SEMESTERS = ['All', 'Sem 1', 'Sem 2', 'Sem 3', 'Sem 4',
                         'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'];
const EXAM_YEARS = ['All', '2023', '2022', '2021', '2020', '2019'];

export default function PapersPage() {
  const [papers,   setPapers]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [filters,  setFilters]  = useState({
    year: 'All', semester: 'All', examYear: 'All'
  });

  // Fetch papers from backend
const fetchPapers = async () => {
  setLoading(true);
  try {
    const params = {};
    if (filters.year     !== 'All') params.year     = filters.year;
    if (filters.semester !== 'All') params.semester = filters.semester;
    if (filters.examYear !== 'All') params.examYear = filters.examYear;
    if (search.trim())              params.subject  = search.trim();

    const res = await api.get('/api/papers', { params });

    setPapers(res.data.papers);
  } catch (err) {
    console.log('Error:', err.response?.data || err.message);
    toast.error('Failed to load papers');
  } finally {
    setLoading(false);
  }
};

  // Fetch whenever filters change
  useEffect(() => {
    fetchPapers();
  }, [filters]);

  // Search on Enter key
  const handleSearchKey = (e) => {
    if (e.key === 'Enter') fetchPapers();
  };

  const clearFilters = () => {
    setFilters({ year: 'All', semester: 'All', examYear: 'All' });
    setSearch('');
  };

  const activeFilterCount = Object.values(filters)
    .filter(v => v !== 'All').length + (search ? 1 : 0);

  return (
    <div className="papers-wrapper">
      <Navbar />

      <main className="papers-main">

        {/* Header */}
        <div className="papers-header">
          <div>
            <h1 className="papers-title">📄 PYQ Papers</h1>
            <p className="papers-sub">
              ENTC Department — Previous Year Question Papers
            </p>
          </div>
          <div className="papers-count">
            <span>{papers.length}</span> papers found
          </div>
        </div>

        {/* Search bar */}
        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by subject name... (press Enter)"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={handleSearchKey}
          />
          {search && (
            <button className="clear-search" onClick={() => { setSearch(''); fetchPapers(); }}>
              <FiX size={16} />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <div className="filter-label">
            <FiFilter size={14} />
            <span>Filter by:</span>
          </div>

          {/* Year filter */}
          <div className="filter-group">
            {YEARS.map(y => (
              <button
                key={y}
                className={`filter-btn ${filters.year === y ? 'active' : ''}`}
                onClick={() => setFilters({ ...filters, year: y })}
              >
                {y}
              </button>
            ))}
          </div>

          <div className="filter-divider" />

          {/* Semester filter */}
          <div className="filter-group">
            {SEMESTERS.map(s => (
              <button
                key={s}
                className={`filter-btn ${filters.semester === s ? 'active' : ''}`}
                onClick={() => setFilters({ ...filters, semester: s })}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="filter-divider" />

          {/* Exam year filter */}
          <div className="filter-group">
            {EXAM_YEARS.map(y => (
              <button
                key={y}
                className={`filter-btn ${filters.examYear === y ? 'active' : ''}`}
                onClick={() => setFilters({ ...filters, examYear: y })}
              >
                {y}
              </button>
            ))}
          </div>

          {/* Clear filters */}
          {activeFilterCount > 0 && (
            <button className="clear-filters" onClick={clearFilters}>
              <FiX size={13} /> Clear ({activeFilterCount})
            </button>
          )}
        </div>

        {/* Papers grid */}
        {loading ? (
          <div className="papers-loading">
            <div className="spinner-large" />
            <p>Loading papers...</p>
          </div>
        ) : papers.length === 0 ? (
          <div className="papers-empty">
            <p>😕 No papers found for selected filters.</p>
            <button onClick={clearFilters} className="reset-btn">
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="papers-grid">
            {papers.map(paper => (
              <PaperCard key={paper._id} paper={paper} />
            ))}
          </div>
        )}

      </main>
    </div>
  );
}

// ── Paper Card ─────────────────────────────────────────
function PaperCard({ paper }) {
  const semColors = {
    'Sem 1': '#3b82f6', 'Sem 2': '#06b6d4',
    'Sem 3': '#8b5cf6', 'Sem 4': '#ec4899',
    'Sem 5': '#f59e0b', 'Sem 6': '#10b981',
    'Sem 7': '#ef4444', 'Sem 8': '#6366f1',
  };
  const color = semColors[paper.semester] || '#3b82f6';

  return (
    <div className="paper-card">
      <div className="paper-card-top" style={{ borderColor: color + '40' }}>
        <div className="paper-badges">
          <span className="paper-badge" style={{ background: color + '20', color }}>
            {paper.semester}
          </span>
          <span className="paper-badge year-badge">
            {paper.year}
          </span>
        </div>
        <span className="paper-exam-year">{paper.examYear}</span>
      </div>

      <div className="paper-card-body">
        <h3 className="paper-subject">{paper.subject}</h3>
        <p className="paper-title-text">{paper.title}</p>
      </div>

      <div className="paper-card-footer">
        <a
          href={paper.fileUrl}
          target="_blank"
          rel="noreferrer"
          className="download-btn"
        >
          <FiExternalLink size={15} />
          View / Download
        </a>
      </div>
    </div>
  );
}