const WorkoutLog = require('../models/WorkoutLog');

// @desc    Create a workout log
// @route   POST /api/workout/log
// @access  Private
const logWorkout = async (req, res) => {
  try {
    const { exercise, sets, reps, weight, date } = req.body;

    if (!exercise || sets == null || reps == null || weight == null) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const log = await WorkoutLog.create({
      user: req.user._id,
      exercise,
      sets,
      reps,
      weight,
      date: date || Date.now()
    });

    res.status(201).json(log);
  } catch (error) {
    console.error('Error logging workout:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get user workout history
// @route   GET /api/workout/history
// @access  Private
const getWorkoutHistory = async (req, res) => {
  try {
    const logs = await WorkoutLog.find({ user: req.user._id }).sort({ date: -1 });
    res.json(logs);
  } catch (error) {
    console.error('Error getting history:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  logWorkout,
  getWorkoutHistory,
};
