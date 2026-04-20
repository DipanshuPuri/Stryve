const WorkoutLog = require('../models/WorkoutLog');
const WeightLog = require('../models/WeightLog');

// @desc    Get analytics dashboard data
// @route   GET /api/analytics
// @access  Private
const getAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Weight Progress (Historical sorting)
    const weightLogs = await WeightLog.find({ user: userId }).sort({ date: 1 });
    
    // 2. Workout Consistency (Group by date for last 14 days)
    const workoutLogs = await WorkoutLog.find({ user: userId });
    
    // Aggregation logic for frontend charts
    const activityMap = {};
    const muscleMap = {};
    
    workoutLogs.forEach(w => {
      const dateStr = w.date.toISOString().split('T')[0];
      activityMap[dateStr] = (activityMap[dateStr] || 0) + 1;
      
      const ex = (w.exercise || '').toLowerCase();
      // Heuristic grouping to simulate muscle score trends requested
      const group = (
        ex.includes('curl') ? 'Biceps' :
        (ex.includes('bench') || ex.includes('push') || ex.includes('chest') || ex.includes('fly')) ? 'Chest' :
        (ex.includes('squat') || ex.includes('leg') || ex.includes('calf') || ex.includes('deadlift')) ? 'Legs' :
        (ex.includes('row') || ex.includes('pull') || ex.includes('lat')) ? 'Back' : 'Other'
      );
                     
      // Simulated trend formula using Volume Load
      muscleMap[group] = (muscleMap[group] || 0) + (w.sets * w.reps * (w.weight || 5));
    });

    res.json({
      weightHistory: weightLogs,
      consistency: activityMap,
      muscleTrends: muscleMap
    });
  } catch(err) {
    console.error('Analytics Error:', err);
    res.status(500).json({ message: 'Server Error loading analytics algorithms' });
  }
};
module.exports = { getAnalytics };
