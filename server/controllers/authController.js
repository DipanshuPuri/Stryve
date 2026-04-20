const jwt = require('jsonwebtoken');
const User = require('../models/User');
const WeightLog = require('../models/WeightLog');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, age, weight, height, goal } = req.body;

    if (!name || !email || !password || !age || !weight || !height || !goal) {
      return res.status(400).json({ message: 'Please add all fields' });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      age,
      weight,
      height,
      goal,
      fitnessLevel: 'Beginner',
      onboardingCompleted: false
    });

    if (user) {
      // Also log the first weight log 
      await WeightLog.create({ user: user._id, weight: user.weight });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        weight: user.weight,
        height: user.height,
        goal: user.goal,
        fitnessLevel: user.fitnessLevel,
        onboardingCompleted: user.onboardingCompleted,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        weight: user.weight,
        height: user.height,
        goal: user.goal,
        fitnessLevel: user.fitnessLevel,
        onboardingCompleted: user.onboardingCompleted,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get user profile (via token)
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        weight: user.weight,
        height: user.height,
        goal: user.goal,
        fitnessLevel: user.fitnessLevel,
        onboardingCompleted: user.onboardingCompleted,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.age = req.body.age || user.age;
    user.height = req.body.height || user.height;
    user.goal = req.body.goal || user.goal;

    if (req.body.password) {
      user.password = req.body.password;
    }

    if (req.body.weight && Number(req.body.weight) !== user.weight) {
      user.weight = Number(req.body.weight);
      // Log historical bodyweight
      await WeightLog.create({ user: user._id, weight: user.weight });
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      age: updatedUser.age,
      weight: updatedUser.weight,
      height: updatedUser.height,
      goal: updatedUser.goal,
      fitnessLevel: updatedUser.fitnessLevel,
      onboardingCompleted: updatedUser.onboardingCompleted,
      token: generateToken(updatedUser._id) // keep state alive
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Complete onboarding
// @route   POST /api/auth/onboarding
// @access  Private
const completeOnboarding = async (req, res) => {
  try {
    const { frequency, intensity, goals, weakMuscles } = req.body;
    const user = await User.findById(req.user._id);
    
    user.workoutFrequency = frequency;
    user.intensity = intensity;
    user.weakMuscles = weakMuscles;

    if (frequency >= 5 && intensity === 'High') user.fitnessLevel = 'Advanced';
    else if (frequency >= 3) user.fitnessLevel = 'Intermediate';
    else user.fitnessLevel = 'Beginner';

    user.onboardingCompleted = true;
    if (goals) user.goal = Array.isArray(goals) ? goals[0] : goals;

    const updated = await user.save();
    
    // Log initial weight track from when they registered
    const existingLog = await WeightLog.findOne({ user: user._id });
    if (!existingLog && updated.weight) {
      await WeightLog.create({ user: user._id, weight: updated.weight });
    }

    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      age: updated.age,
      weight: updated.weight,
      height: updated.height,
      goal: updated.goal,
      fitnessLevel: updated.fitnessLevel,
      onboardingCompleted: updated.onboardingCompleted,
      token: generateToken(updated._id) // send a fresh token reflecting state
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateProfile,
  completeOnboarding
};
