const mongoose = require('mongoose');
const dotenv   = require('dotenv');
const Paper    = require('./models/Paper');

dotenv.config();

const samplePapers = [
  // 1st Year Sem 1
  { title: 'Engineering Mathematics I — 2023', subject: 'Engineering Mathematics I',
    year: '1st Year', semester: 'Sem 1', examYear: '2023',
    fileUrl: 'https://drive.google.com/file/d/sample1' },
  { title: 'Engineering Physics — 2023', subject: 'Engineering Physics',
    year: '1st Year', semester: 'Sem 1', examYear: '2023',
    fileUrl: 'https://drive.google.com/file/d/sample2' },
  { title: 'Engineering Chemistry — 2022', subject: 'Engineering Chemistry',
    year: '1st Year', semester: 'Sem 2', examYear: '2022',
    fileUrl: 'https://drive.google.com/file/d/sample3' },

  // 2nd Year
  { title: 'Network Analysis — 2023', subject: 'Network Analysis',
    year: '2nd Year', semester: 'Sem 3', examYear: '2023',
    fileUrl: 'https://drive.google.com/file/d/sample4' },
  { title: 'Electronic Devices — 2023', subject: 'Electronic Devices',
    year: '2nd Year', semester: 'Sem 3', examYear: '2023',
    fileUrl: 'https://drive.google.com/file/d/sample5' },
  { title: 'Analog Circuits — 2023', subject: 'Analog Circuits',
    year: '2nd Year', semester: 'Sem 4', examYear: '2023',
    fileUrl: 'https://drive.google.com/file/d/sample6' },
  { title: 'Digital Electronics — 2022', subject: 'Digital Electronics',
    year: '2nd Year', semester: 'Sem 4', examYear: '2022',
    fileUrl: 'https://drive.google.com/file/d/sample7' },

  // 3rd Year
  { title: 'Signals & Systems — 2023', subject: 'Signals & Systems',
    year: '3rd Year', semester: 'Sem 5', examYear: '2023',
    fileUrl: 'https://drive.google.com/file/d/sample8' },
  { title: 'Microprocessors — 2023', subject: 'Microprocessors',
    year: '3rd Year', semester: 'Sem 5', examYear: '2023',
    fileUrl: 'https://drive.google.com/file/d/sample9' },
  { title: 'Communication Engineering — 2023', subject: 'Communication Engineering',
    year: '3rd Year', semester: 'Sem 6', examYear: '2023',
    fileUrl: 'https://drive.google.com/file/d/sample10' },
  { title: 'Control Systems — 2022', subject: 'Control Systems',
    year: '3rd Year', semester: 'Sem 6', examYear: '2022',
    fileUrl: 'https://drive.google.com/file/d/sample11' },

  // 4th Year
  { title: 'VLSI Design — 2023', subject: 'VLSI Design',
    year: '4th Year', semester: 'Sem 7', examYear: '2023',
    fileUrl: 'https://drive.google.com/file/d/sample12' },
  { title: 'Digital Signal Processing — 2023', subject: 'Digital Signal Processing',
    year: '4th Year', semester: 'Sem 7', examYear: '2023',
    fileUrl: 'https://drive.google.com/file/d/sample13' },
  { title: 'Wireless Communication — 2023', subject: 'Wireless Communication',
    year: '4th Year', semester: 'Sem 8', examYear: '2023',
    fileUrl: 'https://drive.google.com/file/d/sample14' },
];

async function seedPapers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Paper.deleteMany({});
    console.log('🗑️  Cleared existing papers');

    await Paper.insertMany(samplePapers);
    console.log(`✅ Inserted ${samplePapers.length} sample papers`);

    mongoose.disconnect();
    console.log('✅ Done! Run the app now.');
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

seedPapers();