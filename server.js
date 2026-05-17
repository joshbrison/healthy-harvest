const app = require('./src/app');
const connectDB = require('./src/config/database');

// Connect to database
connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
const express = require('express');
const multer = require('multer');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Set up multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, JPEG, PNG images are allowed'));
    }
  }
});

// Mock AI plant detection function
function isPlantImageMock(buffer) {
  // TODO: Replace with real AI model
  // For now, randomly decide if it's a plant (80% chance)
  return Math.random() < 0.8;
}

// Diagnose endpoint
app.post('/api/diagnose', upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No images uploaded.' });
    }

    // Check if all images are plant images (mocked)
    let plantCount = 0;
    for (const file of req.files) {
      if (isPlantImageMock(file.buffer)) plantCount++;
    }
    const isPlant = plantCount >= Math.ceil(req.files.length / 2);

    if (!isPlant) {
      return res.json({
        isPlant: false,
        message: 'Sorry, this system was only designed for plants (leaves, flowers, roots, stems). Kindly check the image you have uploaded. If it is not a plant, change it. If it is a plant, please try again. Thank you.'
      });
    }

    // If plant, return mock diagnosis (expand later)
    return res.json({
      isPlant: true,
      message: 'Plant image detected. (Diagnosis logic to be implemented.)'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});