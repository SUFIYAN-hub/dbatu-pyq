const mongoose = require('mongoose');

const paperSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: String,
    required: true,
    enum: ['1st Year', '2nd Year', '3rd Year', '4th Year']
  },
  semester: {
    type: String,
    required: true,
    enum: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8']
  },
  examYear: {
    type: String,
    required: true   // e.g. "2023", "2022"
  },
  department: {
    type: String,
    default: 'ENTC'
  },
  fileUrl: {
    type: String,
    required: true   // Google Drive link or any PDF link
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Paper', paperSchema);