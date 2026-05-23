import React, { useState, useEffect } from "react";
import api from "../utils/api";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import { FiClock, FiPlay, FiBookOpen } from "react-icons/fi";
import "./GatePage.css";

export default function GatePage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [testStarted, setTestStarted] = useState(false);
  const [filters, setFilters] = useState({ topic: "All", examYear: "All" });

  const TOPICS = [
    "All",
    "Network Theory",
    "Electronic Devices",
    "Analog Circuits",
    "Digital Circuits",
    "Signals & Systems",
    "Control Systems",
    "Communications",
    "Electromagnetics",
    "Engineering Mathematics",
  ];
  const YEARS = ["All", "2023", "2022", "2021", "2020", "2019"];

  // eslint-disable-next-line
 useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = {};
      if (filters.topic !== "All") params.topic = filters.topic;
      if (filters.examYear !== "All") params.examYear = filters.examYear;

      const res = await api.get("/api/gate", {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions(res.data.questions);
    } catch {
      toast.error("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  // Start test — need at least 1 question
  const handleStartTest = () => {
    if (questions.length === 0) {
      toast.error(
        "No questions available. Admin needs to add questions first!",
      );
      return;
    }
    setTestStarted(true);
  };

  // If test started show the test interface
  if (testStarted) {
    return (
      <PracticeTest
        questions={questions}
        onExit={() => setTestStarted(false)}
      />
    );
  }

  return (
    <div className="gate-wrapper">
      <Navbar />
      <main className="gate-main">
        {/* Header */}
        <div className="gate-header">
          <div>
            <h1 className="gate-title">🏆 GATE ECE Preparation</h1>
            <p className="gate-sub">
              Practice previous year GATE questions with timed tests
            </p>
          </div>
          <div className="gate-stats-mini">
            <div className="mini-stat">
              <FiBookOpen size={18} />
              <span>{questions.length} Questions</span>
            </div>
            <div className="mini-stat">
              <FiClock size={18} />
              <span>3 Hours</span>
            </div>
          </div>
        </div>

        {/* Info cards */}
        <div className="gate-info-cards">
          <div className="info-card">
            <div className="info-icon">📝</div>
            <h3>MCQ Format</h3>
            <p>All questions are multiple choice with 4 options</p>
          </div>
          <div className="info-card">
            <div className="info-icon">⏱️</div>
            <h3>Timed Test</h3>
            <p>3 hour countdown timer just like the real GATE exam</p>
          </div>
          <div className="info-card">
            <div className="info-icon">📊</div>
            <h3>Instant Result</h3>
            <p>See your score and correct answers immediately</p>
          </div>
          <div className="info-card">
            <div className="info-icon">🎯</div>
            <h3>Topic Wise</h3>
            <p>Filter by topic to practice specific subjects</p>
          </div>
        </div>

        {/* Filters */}
        <div className="gate-filters">
          <div className="filter-section">
            <span className="filter-label">Topic:</span>
            <div className="filter-btns">
              {TOPICS.map((t) => (
                <button
                  key={t}
                  className={`filter-btn ${filters.topic === t ? "active" : ""}`}
                  onClick={() => setFilters({ ...filters, topic: t })}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <span className="filter-label">Year:</span>
            <div className="filter-btns">
              {YEARS.map((y) => (
                <button
                  key={y}
                  className={`filter-btn ${filters.examYear === y ? "active" : ""}`}
                  onClick={() => setFilters({ ...filters, examYear: y })}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Start test button */}
        <div className="start-section">
          {loading ? (
            <div className="gate-loading">
              <div className="spinner-large" />
              <p>Loading questions...</p>
            </div>
          ) : questions.length === 0 ? (
            <div className="no-questions">
              <p>😕 No questions found for selected filters.</p>
              <p style={{ fontSize: "0.85rem", marginTop: 8 }}>
                Try different filters or ask admin to add questions.
              </p>
            </div>
          ) : (
            <button className="start-btn" onClick={handleStartTest}>
              <FiPlay size={20} />
              Start Practice Test ({questions.length} Questions)
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Practice Test Component
// ─────────────────────────────────────────────────────────
function PracticeTest({ questions, onExit }) {
  const TOTAL_TIME = 3 * 60 * 60; // 3 hours in seconds

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: 'A' }
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  // eslint-disable-next-line
  useEffect(() => {
    if (submitted) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, submitted]);
  
  // Format time as HH:MM:SS
  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleAnswer = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = () => {
    // Calculate score
    let correct = 0;
    let wrong = 0;
    let skipped = 0;
    let totalMarks = 0;
    let scored = 0;

    questions.forEach((q) => {
      const marks = parseInt(q.marks) || 1;
      totalMarks += marks;

      if (!answers[q._id]) {
        skipped++;
      } else if (answers[q._id] === q.correctAnswer) {
        correct++;
        scored += marks;
      } else {
        wrong++;
        // GATE has negative marking: -1/3 for 1 mark, -2/3 for 2 marks
        scored -= marks / 3;
      }
    });

    setResult({
      correct,
      wrong,
      skipped,
      totalMarks,
      scored: Math.max(0, parseFloat(scored.toFixed(2))),
      percentage: Math.max(
        0,
        parseFloat(((scored / totalMarks) * 100).toFixed(1)),
      ),
    });
    setSubmitted(true);
  };

  // Show result screen
  if (submitted && result) {
    return (
      <ResultScreen
        result={result}
        questions={questions}
        answers={answers}
        onExit={onExit}
      />
    );
  }

  const q = questions[current];
  const answered = Object.keys(answers).length;
  const OPTIONS = ["A", "B", "C", "D"];
  const isLowTime = timeLeft < 600; // less than 10 mins

  return (
    <div className="test-wrapper">
      {/* Test header */}
      <div className="test-header">
        <div className="test-logo">🏆 GATE Practice Test</div>

        <div className={`test-timer ${isLowTime ? "low" : ""}`}>
          <FiClock size={16} />
          {formatTime(timeLeft)}
        </div>

        <div className="test-progress-info">
          <span>
            {answered}/{questions.length} answered
          </span>
          <button
            className="submit-early-btn"
            onClick={() => {
              if (window.confirm("Submit test now?")) handleSubmit();
            }}
          >
            Submit Test
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="progress-bar-wrap">
        <div
          className="progress-bar-fill"
          style={{ width: `${((current + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="test-body">
        {/* Question panel */}
        <div className="question-panel">
          <div className="q-meta">
            <span className="q-num-badge">
              Q {current + 1} of {questions.length}
            </span>
            <span className="q-topic-badge">{q.topic}</span>
            <span className="q-marks-badge">
              {q.marks} Mark{q.marks > 1 ? "s" : ""}
            </span>
            <span className="q-year-badge">{q.examYear}</span>
          </div>

          <p className="q-question">{q.question}</p>

          <div className="options-list">
            {OPTIONS.map((opt) => (
              <button
                key={opt}
                className={`option-btn
                  ${answers[q._id] === opt ? "selected" : ""}
                `}
                onClick={() => handleAnswer(q._id, opt)}
              >
                <span className="opt-label">{opt}</span>
                <span className="opt-text">{q[`option${opt}`]}</span>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="q-navigation">
            <button
              className="nav-btn"
              onClick={() => setCurrent((prev) => prev - 1)}
              disabled={current === 0}
            >
              ← Previous
            </button>

            <button
              className="nav-btn clear"
              onClick={() => {
                const newAnswers = { ...answers };
                delete newAnswers[q._id];
                setAnswers(newAnswers);
              }}
            >
              Clear
            </button>

            {current < questions.length - 1 ? (
              <button
                className="nav-btn next"
                onClick={() => setCurrent((prev) => prev + 1)}
              >
                Next →
              </button>
            ) : (
              <button
                className="nav-btn submit"
                onClick={() => {
                  if (window.confirm("Submit the test?")) handleSubmit();
                }}
              >
                Submit ✓
              </button>
            )}
          </div>
        </div>

        {/* Question palette */}
        <div className="question-palette">
          <h4 className="palette-title">Question Palette</h4>
          <div className="palette-grid">
            {questions.map((ques, idx) => (
              <button
                key={ques._id}
                className={`palette-btn
                  ${idx === current ? "current" : ""}
                  ${answers[ques._id] ? "answered" : ""}
                `}
                onClick={() => setCurrent(idx)}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <div className="palette-legend">
            <div className="legend-item">
              <span className="legend-dot answered" /> Answered
            </div>
            <div className="legend-item">
              <span className="legend-dot" /> Not Answered
            </div>
            <div className="legend-item">
              <span className="legend-dot current" /> Current
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Result Screen Component
// ─────────────────────────────────────────────────────────
function ResultScreen({ result, questions, answers, onExit }) {
  const [showReview, setShowReview] = useState(false);

  const getGrade = (pct) => {
    if (pct >= 80) return { label: "Excellent! 🎉", color: "#10b981" };
    if (pct >= 60) return { label: "Good Job! 👍", color: "#3b82f6" };
    if (pct >= 40) return { label: "Keep Practicing 💪", color: "#f59e0b" };
    return { label: "Need More Practice 📚", color: "#ef4444" };
  };

  const grade = getGrade(result.percentage);

  return (
    <div className="result-wrapper">
      <Navbar />
      <main className="result-main">
        {/* Score card */}
        <div className="score-card">
          <div className="score-grade" style={{ color: grade.color }}>
            {grade.label}
          </div>
          <div className="score-circle" style={{ borderColor: grade.color }}>
            <span className="score-pct">{result.percentage}%</span>
            <span className="score-label">Score</span>
          </div>
          <div className="score-marks">
            {result.scored} / {result.totalMarks} marks
          </div>
        </div>

        {/* Stats */}
        <div className="result-stats">
          <div className="result-stat correct">
            <span className="stat-num">{result.correct}</span>
            <span className="stat-lbl">✅ Correct</span>
          </div>
          <div className="result-stat wrong">
            <span className="stat-num">{result.wrong}</span>
            <span className="stat-lbl">❌ Wrong</span>
          </div>
          <div className="result-stat skipped">
            <span className="stat-num">{result.skipped}</span>
            <span className="stat-lbl">⏭️ Skipped</span>
          </div>
          <div className="result-stat total">
            <span className="stat-num">{questions.length}</span>
            <span className="stat-lbl">📝 Total</span>
          </div>
        </div>

        <p className="negative-note">
          * GATE negative marking applied: -1/3 for wrong 1-mark, -2/3 for wrong
          2-mark questions
        </p>

        {/* Action buttons */}
        <div className="result-actions">
          <button
            className="review-btn"
            onClick={() => setShowReview(!showReview)}
          >
            {showReview ? "Hide Review" : "📋 Review Answers"}
          </button>
          <button className="exit-btn" onClick={onExit}>
            🔄 Practice Again
          </button>
        </div>

        {/* Answer review */}
        {showReview && (
          <div className="review-section">
            <h3 className="review-title">Answer Review</h3>
            {questions.map((q, i) => {
              const userAns = answers[q._id];
              const isCorrect = userAns === q.correctAnswer;
              const isSkipped = !userAns;

              return (
                <div
                  key={q._id}
                  className={`review-item
                    ${isSkipped ? "skipped" : isCorrect ? "correct" : "wrong"}
                  `}
                >
                  <div className="review-q-top">
                    <span className="review-num">Q{i + 1}</span>
                    <span className="review-topic">{q.topic}</span>
                    <span
                      className={`review-status
                      ${isSkipped ? "skip" : isCorrect ? "ok" : "fail"}
                    `}
                    >
                      {isSkipped
                        ? "⏭ Skipped"
                        : isCorrect
                          ? "✅ Correct"
                          : "❌ Wrong"}
                    </span>
                  </div>

                  <p className="review-q-text">{q.question}</p>

                  <div className="review-options">
                    {["A", "B", "C", "D"].map((opt) => (
                      <div
                        key={opt}
                        className={`review-opt
                          ${opt === q.correctAnswer ? "correct-opt" : ""}
                          ${opt === userAns && !isCorrect ? "wrong-opt" : ""}
                        `}
                      >
                        <strong>{opt}.</strong> {q[`option${opt}`]}
                        {opt === q.correctAnswer && (
                          <span className="correct-tag">✓ Correct</span>
                        )}
                        {opt === userAns && !isCorrect && (
                          <span className="wrong-tag">✗ Your answer</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
