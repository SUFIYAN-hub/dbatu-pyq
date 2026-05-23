const express = require('express');
const router  = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { body, validationResult } = require('express-validator');

// Gate question schema — create model first
const mongoose = require('mongoose');

const gateSchema = new mongoose.Schema({
  question:      { type: String, required: true },
  optionA:       { type: String, required: true },
  optionB:       { type: String, required: true },
  optionC:       { type: String, required: true },
  optionD:       { type: String, required: true },
  correctAnswer: { type: String, enum: ['A','B','C','D'], required: true },
  topic:         { type: String, required: true },
  examYear:      { type: String, required: true },
  marks:         { type: String, default: '1' }
}, { timestamps: true });

const GateQuestion = mongoose.model('GateQuestion', gateSchema);

// GET all questions
router.get('/', protect, async (req, res) => {
  try {
    const questions = await GateQuestion.find().sort({ createdAt: -1 });
    res.json({ questions });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST add question — admin only
router.post('/', protect, adminOnly, [
  body('question').trim().notEmpty().withMessage('Question is required'),
  body('optionA').trim().notEmpty().withMessage('Option A is required'),
  body('optionB').trim().notEmpty().withMessage('Option B is required'),
  body('optionC').trim().notEmpty().withMessage('Option C is required'),
  body('optionD').trim().notEmpty().withMessage('Option D is required'),
  body('correctAnswer').isIn(['A','B','C','D']).withMessage('Invalid answer'),
  body('examYear').isLength({ min:4, max:4 }).withMessage('Invalid year'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ message: errors.array()[0].msg });
  try {
    const q = await GateQuestion.create(req.body);
    res.status(201).json({ message: 'Question added!', question: q });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE question — admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await GateQuestion.findByIdAndDelete(req.params.id);
    res.json({ message: 'Question deleted!' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;