const express = require('express');
const router = express.Router();
const { calculateNutrition } = require('../controllers/nutritionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/calculate', protect, calculateNutrition);

module.exports = router;
