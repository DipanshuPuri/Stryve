const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add an exercise name'],
      trim: true,
      unique: true,
    },
    muscleGroup: {
      type: String,
      required: [true, 'Please add a muscle group'],
      enum: ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'legs', 'abs'],
      lowercase: true,
    },
    subGroup: {
      type: String,
      required: [true, 'Please add a sub-muscle group'],
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    description: {
      type: String,
      default: '',
    },
    tips: {
      type: String,
      default: '',
    },
    alternative: {
      type: String,
      default: '',
    },
    equipmentType: {
      type: String,
      enum: ['barbell', 'dumbbell', 'cable', 'machine', 'bodyweight', 'band'],
      default: 'barbell',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Exercise', exerciseSchema);
