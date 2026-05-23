const express    = require('express');
const router     = express.Router();
const Paper      = require('../models/Paper');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { body, validationResult } = require('express-validator');

// ── GET all papers (with filters) ───────────────────────
// GET /api/papers?year=1st Year&semester=Sem 1&examYear=2023
router.get('/', protect, async (req, res) => {
  try {
    const filter = { department: 'ENTC' };

    if (req.query.year)     filter.year     = req.query.year;
    if (req.query.semester) filter.semester = req.query.semester;
    if (req.query.examYear) filter.examYear = req.query.examYear;
    if (req.query.subject)  filter.subject  = {
      $regex: req.query.subject, $options: 'i'
    };

    const papers = await Paper.find(filter)
      .sort({ createdAt: -1 });

    res.json({ papers });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ── ADD paper (admin only) ───────────────────────────────
// POST /api/papers
router.post('/', protect, adminOnly, [

  body('title')
    .trim().notEmpty().withMessage('Title is required'),

  body('subject')
    .trim().notEmpty().withMessage('Subject is required'),

  body('year')
    .notEmpty().withMessage('Year is required')
    .isIn(['1st Year','2nd Year','3rd Year','4th Year'])
    .withMessage('Invalid year'),

  body('semester')
    .notEmpty().withMessage('Semester is required')
    .isIn(['Sem 1','Sem 2','Sem 3','Sem 4','Sem 5','Sem 6','Sem 7','Sem 8'])
    .withMessage('Invalid semester'),

  body('examYear')
    .trim().notEmpty().withMessage('Exam year is required')
    .isLength({ min: 4, max: 4 }).withMessage('Exam year must be 4 digits'),

  body('fileUrl')
    .trim().notEmpty().withMessage('File URL is required')
    .isURL().withMessage('Please enter a valid URL'),

], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    const paper = await Paper.create({
      ...req.body,
      uploadedBy: req.user._id
    });
    res.status(201).json({ message: 'Paper added!', paper });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ── DELETE paper (admin only) ────────────────────────────
// DELETE /api/papers/:id
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);
    if (!paper) return res.status(404).json({ message: 'Paper not found' });

    await paper.deleteOne();
    res.json({ message: 'Paper deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ── UPDATE paper (admin only) ────────────────────────────
// PUT /api/papers/:id
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const paper = await Paper.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!paper) return res.status(404).json({ message: 'Paper not found' });
    res.json({ message: 'Paper updated!', paper });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;