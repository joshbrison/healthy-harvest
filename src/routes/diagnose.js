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

const express = require('express');
const multer = require('multer');
const router = express.Router();
const tf = require('@tensorflow/tfjs-node');
const mobilenet = require('@tensorflow-models/mobilenet');
const Jimp = require('jimp');

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


// Helper: classify image as plant or not using MobileNet, with confidence threshold
async function isPlantImage(buffer) {
  const image = await Jimp.read(buffer);
  image.cover(224, 224);
  const imageBuffer = await image.getBufferAsync(Jimp.MIME_JPEG);
  const uint8array = new Uint8Array(imageBuffer);
  const tensor = tf.node.decodeImage(uint8array, 3).expandDims(0);

  if (!global._mobilenetModel) {
    global._mobilenetModel = await mobilenet.load();
  }
  const model = global._mobilenetModel;
  const predictions = await model.classify(tensor);
  tensor.dispose();

  // Plant keywords
  const plantKeywords = [
    'plant', 'leaf', 'leaves', 'tree', 'flower', 'stem', 'root', 'branch', 'shrub', 'herb', 'blossom', 'foliage', 'petal', 'bark', 'bud', 'cactus', 'succulent', 'vine', 'grass', 'crop', 'seedling', 'seed', 'sprout', 'palm', 'fern', 'moss', 'algae', 'bamboo', 'orchid', 'rose', 'daisy', 'sunflower', 'tulip', 'lily', 'hibiscus', 'bougainvillea', 'marigold', 'jasmine', 'lotus', 'mango', 'banana', 'coconut', 'groundnut', 'peanut', 'potato', 'tomato', 'pepper', 'onion', 'cassava', 'yam', 'maize', 'corn', 'wheat', 'rice', 'sorghum', 'millet', 'bean', 'pea', 'okra', 'eggplant', 'aubergine', 'spinach', 'lettuce', 'cabbage', 'broccoli', 'cauliflower', 'carrot', 'radish', 'turnip', 'beet', 'pumpkin', 'melon', 'watermelon', 'cucumber', 'squash', 'zucchini', 'gourd', 'apple', 'orange', 'lemon', 'lime', 'grape', 'berry', 'strawberry', 'blueberry', 'raspberry', 'blackberry', 'pineapple', 'papaya', 'guava', 'avocado', 'pear', 'plum', 'peach', 'cherry', 'apricot', 'fig', 'date', 'olive', 'pomegranate', 'kiwi', 'passionfruit', 'lychee', 'longan', 'dragonfruit', 'starfruit', 'jackfruit', 'durian', 'rambutan', 'mangosteen', 'sapodilla', 'tamarind', 'cashew', 'almond', 'walnut', 'hazelnut', 'pecan', 'macadamia', 'chestnut', 'acorn', 'nut', 'bean', 'pea', 'legume', 'vegetable', 'fruit'
  ];
  // Only accept as plant if confidence > 70%
  for (const pred of predictions) {
    const label = pred.className.toLowerCase();
    if (plantKeywords.some(keyword => label.includes(keyword)) && pred.probability > 0.7) {
      return true;
    }
  }
  return false;
}

// Disease diagnosis mock (replace with real model logic)
function diagnoseDisease(buffer, plantType = 'groundnut') {
  // TODO: Integrate a real disease model here
  // For now, return a mock result
  return {
    disease: 'Early Leaf Spot',
    confidence: 92,
    severity: 'Medium',
    description: 'Small brown lesions on leaves, surrounded by yellow halos.',
    treatment: [
      'Remove and destroy affected leaves.',
      'Apply recommended fungicide.',
      'Practice crop rotation.'
    ],
    preventive: [
      'Use disease-resistant varieties.',
      'Avoid overhead irrigation.',
      'Ensure good air circulation.'
    ]
  };
}

// Diagnose endpoint
router.post('/', upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No images uploaded.' });
    }

    // Check if majority of images are plant images
    let plantCount = 0;
    for (const file of req.files) {
      if (await isPlantImage(file.buffer)) plantCount++;
    }
    const isPlant = plantCount >= Math.ceil(req.files.length / 2);

    if (!isPlant) {
      return res.json({
        isPlant: false,
        message: 'Sorry, this system was only designed for plants (leaves, flowers, roots, stems). Kindly check the image you have uploaded. If it is not a plant, change it. If it is a plant, please try again. Thank you.'
      });
    }

    // If plant, run disease diagnosis (mock for now)
    // For now, just use the first image for diagnosis
    const plantType = req.body.plantType || 'groundnut';
    const diagnosis = diagnoseDisease(req.files[0].buffer, plantType);
    return res.json({
      isPlant: true,
      diagnosis
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
