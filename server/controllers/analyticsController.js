const WorkoutLog = require('../models/WorkoutLog');
const WeightLog = require('../models/WeightLog');

/**
 * Heuristic AI Engine to generate computational reflections
 */
const generateAIInsights = (weightLogs, activityMap, muscleMap, userGoal) => {
  const insights = {
    summary: '',
    reflection: '',
    focusArea: 'General',
    status: 'Stable',
    consistencyScore: 0
  };

  // 1. Consistency Analysis
  const workoutDays = Object.keys(activityMap).length;
  insights.consistencyScore = Math.min(100, Math.round((workoutDays / 14) * 100));
  
  if (insights.consistencyScore > 70) insights.status = 'Exceptional';
  else if (insights.consistencyScore > 40) insights.status = 'Gaining Momentum';
  else insights.status = 'Initial Phase';

  // 2. Muscle Focus Analysis
  let maxVolume = 0;
  let topMuscle = 'N/A';
  Object.entries(muscleMap).forEach(([muscle, vol]) => {
    if (vol > maxVolume) {
      maxVolume = vol;
      topMuscle = muscle;
    }
  });
  insights.focusArea = topMuscle;

  // 3. Weight Velocity
  let weightChange = 0;
  if (weightLogs.length > 1) {
    weightChange = weightLogs[weightLogs.length - 1].weight - weightLogs[0].weight;
  }
  const velocity = (weightChange / 2).toFixed(2); // approximate kg/week over 14 days

  // 4. Narrative Generation
  const goalStr = userGoal || 'fitness';
  
  insights.summary = `The STRYVE AI Engine recognizes ${insights.status.toLowerCase()} patterns in your behavior over the last 14 days. ` +
    `Your primary hypertrophic focus is currently ${topMuscle}, where you've concentrated peak volume load. ` +
    `Weight trajectory shows a ${weightChange < 0 ? 'descending' : 'ascending'} velocity of ${Math.abs(velocity)}kg per week.`;

  insights.reflection = `Based on your goal to "${goalStr}", the current telemetry suggests a ${insights.consistencyScore > 60 ? 'highly effective' : 'developing'} metabolic state. ` +
    (topMuscle === 'Legs' ? 'Your lower body output is optimal for total hormonal response. ' : 'Upper body volume is dominant; consider incorporating more posterior chain work for kinetic balance. ') +
    `Algorithm suggests maintaining current caloric ${weightChange < 0 ? 'deficit' : 'surplus'} to sustain this momentum.`;

  return insights;
};

// @desc    Get analytics dashboard data
// @route   GET /api/analytics
// @access  Private
const getAnalytics = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User context missing from token' });
    }

    const userId = req.user._id;

    // 1. Weight Progress (Historical sorting)
    const weightLogs = await WeightLog.find({ user: userId }).sort({ date: 1 });
    
    // 2. Workout Consistency (Group by date for last 14 days)
    const workoutLogs = await WorkoutLog.find({ user: userId });
    
    const activityMap = {};
    const muscleMap = {};
    
    workoutLogs.forEach(w => {
      if (!w.date) return;
      let dateObj = w.date;
      if (!(dateObj instanceof Date)) dateObj = new Date(dateObj);
      if (isNaN(dateObj.getTime())) return;

      const dateStr = dateObj.toISOString().split('T')[0];
      activityMap[dateStr] = (activityMap[dateStr] || 0) + 1;
      
      const ex = (w.exercise || '').toLowerCase();
      const group = (
        ex.includes('curl') ? 'Biceps' :
        (ex.includes('bench') || ex.includes('push') || ex.includes('chest') || ex.includes('fly')) ? 'Chest' :
        (ex.includes('squat') || ex.includes('leg') || ex.includes('calf') || ex.includes('deadlift')) ? 'Legs' :
        (ex.includes('row') || ex.includes('pull') || ex.includes('lat')) ? 'Back' : 'Other'
      );
                     
      const sets = Number(w.sets) || 0;
      const reps = Number(w.reps) || 0;
      const weight = Number(w.weight) || 0;
      
      muscleMap[group] = (muscleMap[group] || 0) + (sets * reps * weight);
    });

    const aiInsights = generateAIInsights(weightLogs, activityMap, muscleMap, req.user.goal);

    res.json({
      weightHistory: weightLogs || [],
      consistency: activityMap,
      muscleTrends: muscleMap,
      aiInsights: aiInsights
    });
  } catch(err) {
    console.error('Analytics Error:', err);
    res.status(500).json({ 
        message: 'Computational error during telemetry analysis.', 
        error: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

module.exports = { getAnalytics };
