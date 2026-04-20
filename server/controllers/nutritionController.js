// @desc    Calculate calories and macros based on user stats
// @route   POST /api/nutrition/calculate
// @access  Private
const calculateNutrition = async (req, res) => {
  try {
    // Attempt to pull from request body, fallback to authenticated user profile
    const weight = req.body.weight || req.user.weight;
    const height = req.body.height || req.user.height;
    const age = req.body.age || req.user.age;
    const goal = req.body.goal || req.user.goal;

    if (!weight || !height || !age || !goal) {
      return res.status(400).json({ message: 'Missing required parameters: weight, height, age, goal. Update your profile or pass them in the request.' });
    }

    // Calculate BMR using Mifflin-St Jeor formula (using base +5 as standard default)
    const bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;

    // Calculate TDEE assuming moderate activity (multiplier 1.55)
    let tdee = bmr * 1.55;

    // Adjust target calories based on the goal
    let targetCalories = tdee;
    if (goal === 'Build Muscle') {
      targetCalories += 500; // Caloric surplus
    } else if (goal === 'Lose Weight') {
      targetCalories -= 500; // Caloric deficit
    }
    // 'Improve Endurance' and 'Maintain Health' remain at maintenance (TDEE)

    targetCalories = Math.round(targetCalories);

    // Calculate Macros
    // Protein: 2.0g per kg of bodyweight (between 1.6 - 2.2 range request)
    const proteinGrams = Math.round(weight * 2.0);
    const proteinCals = proteinGrams * 4;

    // Fat: 25% of total calories (middle of 20-30% range request)
    const fatCals = targetCalories * 0.25;
    const fatGrams = Math.round(fatCals / 9);

    // Carbs: Remaining calories
    const remainingCals = targetCalories - proteinCals - fatCals;
    const carbGrams = Math.max(0, Math.round(remainingCals / 4)); // Prevent negative carbs in extreme deficits

    res.json({
      calories: targetCalories,
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      macros: {
        protein: proteinGrams,
        fat: fatGrams,
        carbs: carbGrams,
      }
    });

  } catch (error) {
    console.error('Nutrition calculation error:', error);
    res.status(500).json({ message: 'Server Error computing nutrition profile' });
  }
};

module.exports = { calculateNutrition };
