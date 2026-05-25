import React, { useState, useEffect } from 'react';
import api from '../../utils/api'
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiX } from 'react-icons/fi';
import './Admin.css';

const YEARS     = ['1st Year','2nd Year','3rd Year','4th Year'];
const SEMESTERS = ['Sem 1','Sem 2','Sem 3','Sem 4','Sem 5','Sem 6','Sem 7','Sem 8'];

const empty = {
  title: '', subject: '', year: '1st Year',
  semester: 'Sem 1', examYear: '', fileUrl: ''
};

export default function AdminPapers() {
  const [papers,  setPapers]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form,    setForm]    = useState(empty);
  const [errors,  setErrors]  = useState({});
  const [saving,  setSaving]  = useState(false);

  useEffect(() => { fetchPapers(); }, []);

  const fetchPapers = async () => {
    setLoading(true);
    try {
      const res   = await api.get('/api/papers', {
        
      });
      setPapers(res.data.papers);
    } catch {
      toast.error('Failed to load papers');
    } finally {
      setLoading(false);
    }
  };

  // Validation
  const validate = () => {
    const e = {};
    if (!form.title.trim())    e.title    = 'Title is required';
    if (!form.subject.trim())  e.subject  = 'Subject is required';
    if (!form.examYear.trim()) e.examYear = 'Exam year is required';
    else if (!/^\d{4}$/.test(form.examYear))
      e.examYear = 'Must be 4 digits e.g. 2023';
    if (!form.fileUrl.trim())  e.fileUrl  = 'File URL is required';
    else if (!/^https?:\/\/.+/.test(form.fileUrl))
      e.fileUrl = 'Must be a valid URL starting with http';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      
      await api.post('/api/papers', form, {
        
      });
      toast.success('Paper added successfully!');
      setForm(empty);
      setShowForm(false);
      fetchPapers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add paper');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {

      await api.delete(`/api/papers/${id}`, {
        
      });
      toast.success('Paper deleted!');
      fetchPapers();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name])
      setErrors({ ...errors, [e.target.name]: '' });
  };

  return (
    <div>
      {/* Top bar */}
      <div className="section-topbar">
        <h2 className="section-heading">
          📄 PYQ Papers
          <span className="count-badge">{papers.length}</span>
        </h2>
        <button
          className="add-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? <><FiX /> Cancel</> : <><FiPlus /> Add Paper</>}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <form className="admin-form" onSubmit={handleAdd}>
          <h3 className="form-title">Add New Paper</h3>

          <div className="form-row">
            <div className="form-group">
              <label>Title *</label>
              <input name="title" value={form.title}
                onChange={handleChange}
                placeholder="e.g. Digital Electronics — 2023" />
              {errors.title && <span className="err">{errors.title}</span>}
            </div>
            <div className="form-group">
              <label>Subject *</label>
              <input name="subject" value={form.subject}
                onChange={handleChange}
                placeholder="e.g. Digital Electronics" />
              {errors.subject && <span className="err">{errors.subject}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Year *</label>
              <select name="year" value={form.year} onChange={handleChange}>
                {YEARS.map(y => <option key={y}>{y}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Semester *</label>
              <select name="semester" value={form.semester} onChange={handleChange}>
                {SEMESTERS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Exam Year *</label>
              <input name="examYear" value={form.examYear}
                onChange={handleChange} placeholder="e.g. 2023"
                maxLength={4} />
              {errors.examYear && <span className="err">{errors.examYear}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Google Drive / PDF Link *</label>
            <input name="fileUrl" value={form.fileUrl}
              onChange={handleChange}
              placeholder="https://drive.google.com/file/d/..." />
            {errors.fileUrl && <span className="err">{errors.fileUrl}</span>}
          </div>

          <button type="submit" className="save-btn" disabled={saving}>
            {saving ? 'Saving...' : '✅ Save Paper'}
          </button>
        </form>
      )}

      {/* Papers table */}
      {loading ? (
        <div className="admin-loading">Loading...</div>
      ) : papers.length === 0 ? (
        <div className="admin-empty">No papers yet. Add one above!</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Year</th>
                <th>Semester</th>
                <th>Exam Year</th>
                <th>Link</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {papers.map(p => (
                <tr key={p._id}>
                  <td><span className="subject-name">{p.subject}</span></td>
                  <td>{p.year}</td>
                  <td>{p.semester}</td>
                  <td>{p.examYear}</td>
                  <td>
                    <a href={p.fileUrl} target="_blank"
                      rel="noreferrer" className="view-link">
                      View
                    </a>
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(p._id, p.title)}
                    >
                      <FiTrash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}