const express = require('express');
const router = express.Router();
const { logWorkout, getWorkoutHistory } = require('../controllers/workoutController');
const { protect } = require('../middleware/authMiddleware');

router.post('/log', protect, logWorkout);
router.get('/history', protect, getWorkoutHistory);

module.exports = router;
