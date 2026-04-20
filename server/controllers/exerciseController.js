const Exercise = require('../models/Exercise');

// @desc    Get exercises by muscle group and group by subGroup
// @route   GET /api/exercises/:muscleGroup
// @access  Private
const getExercisesByMuscleGroup = async (req, res) => {
  try {
    const { muscleGroup } = req.params;

    // Fetch exercises for the matching muscle group
    const exercises = await Exercise.find({ muscleGroup: muscleGroup.toLowerCase() });

    // Group the array into an object mapping subGroup -> [exercises]
    const groupedExercises = exercises.reduce((acc, exercise) => {
      const sub = exercise.subGroup;
      if (!acc[sub]) {
        acc[sub] = [];
      }
      acc[sub].push(exercise);
      return acc;
    }, {});

    res.json(groupedExercises);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error loading exercises' });
  }
};

module.exports = {
  getExercisesByMuscleGroup,
};
