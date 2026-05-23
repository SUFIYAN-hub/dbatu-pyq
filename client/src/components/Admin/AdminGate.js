import React, { useState, useEffect } from 'react';
import api from '../../utils/api'
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiX } from 'react-icons/fi';
import './Admin.css';

const TOPICS = [
  'Network Theory', 'Electronic Devices', 'Analog Circuits',
  'Digital Circuits', 'Signals & Systems', 'Control Systems',
  'Communications', 'Electromagnetics', 'Engineering Mathematics'
];

const emptyForm = {
  question: '', optionA: '', optionB: '',
  optionC: '', optionD: '', correctAnswer: 'A',
  topic: 'Network Theory', examYear: '', marks: '1'
};

export default function AdminGate() {
  const [questions, setQuestions] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [showForm,  setShowForm]  = useState(false);
  const [form,      setForm]      = useState(emptyForm);
  const [errors,    setErrors]    = useState({});
  const [saving,    setSaving]    = useState(false);

  useEffect(() => { fetchQuestions(); }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res   = await api.get('/api/gate', {
      });
      setQuestions(res.data.questions);
    } catch {
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const e = {};
    if (!form.question.trim()) e.question = 'Question is required';
    if (!form.optionA.trim())  e.optionA  = 'Option A is required';
    if (!form.optionB.trim())  e.optionB  = 'Option B is required';
    if (!form.optionC.trim())  e.optionC  = 'Option C is required';
    if (!form.optionD.trim())  e.optionD  = 'Option D is required';
    if (!form.examYear.trim()) e.examYear = 'Exam year is required';
    else if (!/^\d{4}$/.test(form.examYear))
      e.examYear = 'Must be 4 digits';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {

      await api.post('/api/gate', form, {
        
      });
      toast.success('Question added!');
      setForm(emptyForm);
      setShowForm(false);
      fetchQuestions();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this question?')) return;
    try {

      await api.delete(`/api/gate/${id}`, {
       
      });
      toast.success('Question deleted!');
      fetchQuestions();
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
      <div className="section-topbar">
        <h2 className="section-heading">
          🏆 GATE Questions
          <span className="count-badge">{questions.length}</span>
        </h2>
        <button className="add-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? <><FiX /> Cancel</> : <><FiPlus /> Add Question</>}
        </button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={handleAdd}>
          <h3 className="form-title">Add GATE Question</h3>

          <div className="form-group">
            <label>Question *</label>
            <textarea name="question" value={form.question}
              onChange={handleChange} rows={3}
              placeholder="Type the question here..." />
            {errors.question && <span className="err">{errors.question}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Option A *</label>
              <input name="optionA" value={form.optionA}
                onChange={handleChange} placeholder="Option A" />
              {errors.optionA && <span className="err">{errors.optionA}</span>}
            </div>
            <div className="form-group">
              <label>Option B *</label>
              <input name="optionB" value={form.optionB}
                onChange={handleChange} placeholder="Option B" />
              {errors.optionB && <span className="err">{errors.optionB}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Option C *</label>
              <input name="optionC" value={form.optionC}
                onChange={handleChange} placeholder="Option C" />
              {errors.optionC && <span className="err">{errors.optionC}</span>}
            </div>
            <div className="form-group">
              <label>Option D *</label>
              <input name="optionD" value={form.optionD}
                onChange={handleChange} placeholder="Option D" />
              {errors.optionD && <span className="err">{errors.optionD}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Correct Answer *</label>
              <select name="correctAnswer" value={form.correctAnswer}
                onChange={handleChange}>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>
            <div className="form-group">
              <label>Topic *</label>
              <select name="topic" value={form.topic} onChange={handleChange}>
                {TOPICS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Exam Year *</label>
              <input name="examYear" value={form.examYear}
                onChange={handleChange} placeholder="2023" maxLength={4} />
              {errors.examYear && <span className="err">{errors.examYear}</span>}
            </div>
            <div className="form-group">
              <label>Marks</label>
              <select name="marks" value={form.marks} onChange={handleChange}>
                <option value="1">1 Mark</option>
                <option value="2">2 Marks</option>
              </select>
            </div>
          </div>

          <button type="submit" className="save-btn" disabled={saving}>
            {saving ? 'Saving...' : '✅ Save Question'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="admin-loading">Loading...</div>
      ) : questions.length === 0 ? (
        <div className="admin-empty">
          No questions yet. Add some above to enable GATE practice tests!
        </div>
      ) : (
        <div className="questions-list">
          {questions.map((q, i) => (
            <div key={q._id} className="question-item">
              <div className="question-top">
                <span className="q-number">Q{i + 1}</span>
                <span className="q-topic">{q.topic}</span>
                <span className="q-year">{q.examYear}</span>
                <span className="q-marks">{q.marks} Mark</span>
                <button className="delete-btn"
                  onClick={() => handleDelete(q._id)}>
                  <FiTrash2 size={13} /> Delete
                </button>
              </div>
              <p className="q-text">{q.question}</p>
              <div className="q-options">
                {['A','B','C','D'].map(opt => (
                  <span key={opt}
                    className={`q-opt ${q.correctAnswer === opt ? 'correct' : ''}`}>
                    <strong>{opt}.</strong> {q[`option${opt}`]}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}