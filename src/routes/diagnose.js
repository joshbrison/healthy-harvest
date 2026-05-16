const express = require('express');
const multer = require('multer');
const diagnoseService = require('../services/diagnoseService');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/diagnose
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }
    // Validate that the image is of a plant
    const isPlant = await diagnoseService.plantImageValidator(req.file.buffer);
    if (!isPlant) {
      return res.status(400).json({ error: 'Uploaded image is not a plant' });
    }
    // Diagnose plant disease
    const result = await diagnoseService.diagnosePlantDisease(req.file.buffer);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Diagnosis failed', details: err.message });
  }
});

module.exports = router;
