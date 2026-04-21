require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const WorkoutLog = require('../models/WorkoutLog');
const WeightLog = require('../models/WeightLog');

const seedAlexSmith = async () => {
  try {
    await connectDB();

    const email = 'alexsmith@gmail.com';
    const password = 'alexsmith@gmail.com';

    // 1. Create or Update User
    let user = await User.findOne({ email });
    if (user) {
      console.log('User exists, resetting logs...');
      await WorkoutLog.deleteMany({ user: user._id });
      await WeightLog.deleteMany({ user: user._id });
    } else {
      user = new User({
        name: 'Alex Smith',
        email: email,
        password: password,
        age: 28,
        weight: 85,
        height: 180,
        goal: 'Lose Weight',
        fitnessLevel: 'Intermediate',
        onboardingCompleted: true
      });
      await user.save();
      console.log('User created successfully.');
    }

    const userId = user._id;
    const now = new Date();

    // 2. Seed Weight Logs (14 days trend)
    const weightLogs = [];
    for (let i = 14; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i);
      // Linear weight loss from 85 to 81.5
      const weight = 85 - (14 - i) * 0.25;
      weightLogs.push({
        user: userId,
        weight: parseFloat(weight.toFixed(1)),
        date: date
      });
    }
    await WeightLog.insertMany(weightLogs);
    console.log(`Seeded ${weightLogs.length} weight entries.`);

    // 3. Seed Workout Logs (12 days of activity)
    const workoutLogs = [];
    const exercises = [
      { name: 'Flat Bench Press', group: 'Chest' },
      { name: 'Push-ups', group: 'Chest' },
      { name: 'Barbell Curl', group: 'Biceps' },
      { name: 'Hammer Curl', group: 'Biceps' },
      { name: 'Barbell Squat', group: 'Legs' },
      { name: 'Leg Press', group: 'Legs' },
      { name: 'Lat Pulldown', group: 'Back' },
      { name: 'Seated Cable Row', group: 'Back' },
      { name: 'Plank', group: 'Abs' }
    ];

    // Every day except 2 rest days
    for (let i = 13; i >= 0; i--) {
      if (i === 4 || i === 9) continue; // Rest days

      const date = new Date();
      date.setDate(now.getDate() - i);

      // Log 2-4 exercises per day
      const dailyCount = 2 + Math.floor(Math.random() * 3);
      const shuffled = [...exercises].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, dailyCount);

      selected.forEach(ex => {
        workoutLogs.push({
          user: userId,
          exercise: ex.name,
          sets: 3 + Math.floor(Math.random() * 2),
          reps: 8 + Math.floor(Math.random() * 4),
          weight: 10 + Math.floor(Math.random() * 40),
          date: date
        });
      });
    }

    await WorkoutLog.insertMany(workoutLogs);
    console.log(`Seeded ${workoutLogs.length} workout logs.`);

    // Update user profile to latest weight
    user.weight = 81.5;
    await user.save();

    console.log('✅ Alex Smith sample data seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding Alex Smith data:', error);
    process.exit(1);
  }
};

seedAlexSmith();
