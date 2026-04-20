const express = require('express');
const router = express.Router();
const { getExercisesByMuscleGroup } = require('../controllers/exerciseController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:muscleGroup', protect, getExercisesByMuscleGroup);

module.exports = router;
