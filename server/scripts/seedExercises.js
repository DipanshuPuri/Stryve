require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Exercise = require('../models/Exercise');

const seedExercises = async () => {
  try {
    await connectDB();
    await Exercise.deleteMany();

    const exercises = [
      // ═══════════════ CHEST ═══════════════
      {
        name: 'Flat Bench Press', muscleGroup: 'chest', subGroup: 'Middle Chest', difficulty: 'Intermediate', equipmentType: 'barbell',
        description: 'The king of chest exercises. Lie on a flat bench and press a barbell upward from chest level to full arm extension.',
        tips: 'Keep your shoulder blades pinched together and feet flat on the floor. Lower the bar to mid-chest level.',
        alternative: 'Dumbbell Bench Press'
      },
      {
        name: 'Dumbbell Bench Press', muscleGroup: 'chest', subGroup: 'Middle Chest', difficulty: 'Intermediate', equipmentType: 'dumbbell',
        description: 'A dumbbell variation of the bench press that allows a greater range of motion and independent arm movement.',
        tips: 'Rotate your wrists slightly inward at the top for a better contraction. Don\'t let the dumbbells drift too wide.',
        alternative: 'Flat Bench Press'
      },
      {
        name: 'Incline Dumbbell Press', muscleGroup: 'chest', subGroup: 'Upper Chest', difficulty: 'Intermediate', equipmentType: 'dumbbell',
        description: 'Targets the upper pectorals by pressing dumbbells on a 30-45 degree incline bench.',
        tips: 'Set the bench to 30-45 degrees. Don\'t flare your elbows excessively — keep them at about 45 degrees.',
        alternative: 'Incline Barbell Press'
      },
      {
        name: 'Incline Barbell Press', muscleGroup: 'chest', subGroup: 'Upper Chest', difficulty: 'Intermediate', equipmentType: 'barbell',
        description: 'A barbell pressing movement on an inclined bench to emphasize the clavicular head of the pectorals.',
        tips: 'Use a slightly narrower grip than flat bench. Control the eccentric (lowering) portion for better muscle activation.',
        alternative: 'Incline Dumbbell Press'
      },
      {
        name: 'Cable Crossover', muscleGroup: 'chest', subGroup: 'Lower Chest', difficulty: 'Advanced', equipmentType: 'cable',
        description: 'An isolation movement using cables to target the lower and inner chest with constant tension throughout the range.',
        tips: 'Set pulleys high, step forward slightly for stability. Squeeze at the bottom and control the negative.',
        alternative: 'Dumbbell Flyes'
      },
      {
        name: 'Dumbbell Flyes', muscleGroup: 'chest', subGroup: 'Middle Chest', difficulty: 'Intermediate', equipmentType: 'dumbbell',
        description: 'An isolation movement that stretches and contracts the pectorals through a wide arc motion.',
        tips: 'Keep a slight bend in your elbows throughout. Focus on the stretch at the bottom and squeeze at the top.',
        alternative: 'Cable Crossover'
      },
      {
        name: 'Push-ups', muscleGroup: 'chest', subGroup: 'Middle Chest', difficulty: 'Beginner', equipmentType: 'bodyweight',
        description: 'The classic bodyweight exercise. Form a plank and lower your body until your chest nearly touches the floor.',
        tips: 'Keep your core tight and body in a straight line. Hands shoulder-width apart, elbows at 45 degrees.',
        alternative: 'Dumbbell Bench Press'
      },
      {
        name: 'Decline Bench Press', muscleGroup: 'chest', subGroup: 'Lower Chest', difficulty: 'Intermediate', equipmentType: 'barbell',
        description: 'A bench press variation performed on a decline bench to target the lower pectoral fibers.',
        tips: 'Secure your legs firmly. Lower the bar to just below your nipple line. Use a spotter for safety.',
        alternative: 'Dips'
      },

      // ═══════════════ BACK ═══════════════
      {
        name: 'Pull-ups', muscleGroup: 'back', subGroup: 'Lats', difficulty: 'Intermediate', equipmentType: 'bodyweight',
        description: 'A compound bodyweight exercise. Hang from a bar with an overhand grip and pull yourself up until your chin clears the bar.',
        tips: 'Engage your lats by pulling your elbows down and back. Avoid swinging or using momentum.',
        alternative: 'Lat Pulldown'
      },
      {
        name: 'Lat Pulldown', muscleGroup: 'back', subGroup: 'Lats', difficulty: 'Beginner', equipmentType: 'cable',
        description: 'A cable machine exercise that mimics the pull-up motion with adjustable resistance.',
        tips: 'Lean back slightly, pull the bar to your upper chest. Squeeze your shoulder blades together at the bottom.',
        alternative: 'Pull-ups'
      },
      {
        name: 'Barbell Row', muscleGroup: 'back', subGroup: 'Mid Back', difficulty: 'Advanced', equipmentType: 'barbell',
        description: 'A compound pulling movement. Bend at the hips and pull a barbell toward your lower chest/upper abdomen.',
        tips: 'Keep your back flat and core braced. Pull to your belly button, not your chest. Squeeze at the top.',
        alternative: 'Dumbbell Row'
      },
      {
        name: 'Dumbbell Row', muscleGroup: 'back', subGroup: 'Mid Back', difficulty: 'Beginner', equipmentType: 'dumbbell',
        description: 'A single-arm rowing exercise performed with one knee on a bench for support.',
        tips: 'Keep your back parallel to the floor. Pull the dumbbell toward your hip, not your shoulder.',
        alternative: 'Barbell Row'
      },
      {
        name: 'Deadlift', muscleGroup: 'back', subGroup: 'Lower Back', difficulty: 'Advanced', equipmentType: 'barbell',
        description: 'The ultimate posterior chain exercise. Lift a loaded barbell from the floor to hip level by extending your hips and knees.',
        tips: 'Keep the bar close to your body. Brace your core hard. Push through your heels and lock out your hips at the top.',
        alternative: 'Romanian Deadlift'
      },
      {
        name: 'Seated Cable Row', muscleGroup: 'back', subGroup: 'Mid Back', difficulty: 'Beginner', equipmentType: 'cable',
        description: 'A seated pulling exercise using a cable machine to target the middle back and rhomboids.',
        tips: 'Sit upright with a slight forward lean at the start. Pull the handle to your stomach, not your chest.',
        alternative: 'Barbell Row'
      },
      {
        name: 'Face Pull', muscleGroup: 'back', subGroup: 'Upper Back', difficulty: 'Beginner', equipmentType: 'cable',
        description: 'A cable exercise targeting the rear deltoids and upper back. Pull the rope toward your face with external rotation.',
        tips: 'Set the cable at face height. Pull apart as you bring the rope toward your face. Pause and squeeze.',
        alternative: 'Reverse Flyes'
      },

      // ═══════════════ SHOULDERS ═══════════════
      {
        name: 'Overhead Press', muscleGroup: 'shoulders', subGroup: 'Front Delt', difficulty: 'Intermediate', equipmentType: 'barbell',
        description: 'A compound pressing movement. Press a barbell from shoulder level to overhead while standing.',
        tips: 'Brace your core and squeeze your glutes. Press the bar slightly behind your head at lockout for proper alignment.',
        alternative: 'Dumbbell Shoulder Press'
      },
      {
        name: 'Dumbbell Shoulder Press', muscleGroup: 'shoulders', subGroup: 'Front Delt', difficulty: 'Intermediate', equipmentType: 'dumbbell',
        description: 'A seated or standing overhead press with dumbbells, allowing independent arm movement.',
        tips: 'Start with dumbbells at ear level. Press straight up without letting your back arch excessively.',
        alternative: 'Overhead Press'
      },
      {
        name: 'Lateral Raises', muscleGroup: 'shoulders', subGroup: 'Side Delt', difficulty: 'Beginner', equipmentType: 'dumbbell',
        description: 'An isolation exercise where you raise dumbbells out to your sides to target the medial deltoid.',
        tips: 'Use lighter weight with strict form. Lead with your elbows, not your hands. Stop at shoulder height.',
        alternative: 'Cable Lateral Raise'
      },
      {
        name: 'Cable Lateral Raise', muscleGroup: 'shoulders', subGroup: 'Side Delt', difficulty: 'Intermediate', equipmentType: 'cable',
        description: 'A cable variation of lateral raises providing constant tension throughout the movement.',
        tips: 'Use the cable from the opposite side for best angle. Keep a slight bend in your elbow throughout.',
        alternative: 'Lateral Raises'
      },
      {
        name: 'Reverse Pec Deck', muscleGroup: 'shoulders', subGroup: 'Rear Delt', difficulty: 'Beginner', equipmentType: 'machine',
        description: 'A machine exercise that isolates the rear deltoids by pulling the handles rearward.',
        tips: 'Keep your chest against the pad. Focus on squeezing your shoulder blades together at the end.',
        alternative: 'Reverse Flyes'
      },
      {
        name: 'Reverse Flyes', muscleGroup: 'shoulders', subGroup: 'Rear Delt', difficulty: 'Beginner', equipmentType: 'dumbbell',
        description: 'Bend forward and raise dumbbells out to the sides to target the rear deltoids.',
        tips: 'Keep your torso nearly parallel to the floor. Use light weight and focus on the mind-muscle connection.',
        alternative: 'Reverse Pec Deck'
      },
      {
        name: 'Arnold Press', muscleGroup: 'shoulders', subGroup: 'Front Delt', difficulty: 'Advanced', equipmentType: 'dumbbell',
        description: 'A rotational shoulder press variation that hits all three delt heads through a full rotational press.',
        tips: 'Start with palms facing you, rotate as you press up. Control the rotation on the way down.',
        alternative: 'Dumbbell Shoulder Press'
      },

      // ═══════════════ BICEPS ═══════════════
      {
        name: 'Barbell Curl', muscleGroup: 'biceps', subGroup: 'Short Head', difficulty: 'Beginner', equipmentType: 'barbell',
        description: 'The foundational bicep exercise. Curl a barbell from full arm extension to shoulder level.',
        tips: 'Keep your elbows pinned to your sides. Don\'t swing the weight — use strict form and control.',
        alternative: 'EZ Bar Curl'
      },
      {
        name: 'EZ Bar Curl', muscleGroup: 'biceps', subGroup: 'Short Head', difficulty: 'Beginner', equipmentType: 'barbell',
        description: 'A curl variation using an EZ bar that reduces wrist strain compared to a straight barbell.',
        tips: 'Use the inner angled grip for short head emphasis, outer grip for long head.',
        alternative: 'Barbell Curl'
      },
      {
        name: 'Incline Dumbbell Curl', muscleGroup: 'biceps', subGroup: 'Long Head', difficulty: 'Intermediate', equipmentType: 'dumbbell',
        description: 'Performed on an incline bench, this curl puts a deep stretch on the long head of the biceps.',
        tips: 'Set the bench to 45-60 degrees. Let your arms hang straight down and curl without moving your upper arm.',
        alternative: 'Concentration Curl'
      },
      {
        name: 'Hammer Curl', muscleGroup: 'biceps', subGroup: 'Brachialis', difficulty: 'Beginner', equipmentType: 'dumbbell',
        description: 'A neutral-grip curl that targets the brachialis and brachioradialis for overall arm thickness.',
        tips: 'Keep palms facing each other throughout. Don\'t rotate your wrists. Curl in a controlled arc.',
        alternative: 'Cross Body Hammer Curl'
      },
      {
        name: 'Preacher Curl', muscleGroup: 'biceps', subGroup: 'Short Head', difficulty: 'Beginner', equipmentType: 'dumbbell',
        description: 'An isolation curl performed on a preacher bench that eliminates momentum and cheating.',
        tips: 'Don\'t fully extend at the bottom to keep tension on the biceps. Squeeze hard at the top.',
        alternative: 'Concentration Curl'
      },
      {
        name: 'Concentration Curl', muscleGroup: 'biceps', subGroup: 'Long Head', difficulty: 'Beginner', equipmentType: 'dumbbell',
        description: 'A seated single-arm curl with your elbow braced against your inner thigh for maximum isolation.',
        tips: 'Supinate (rotate palm up) as you curl for peak contraction. Slow and controlled reps only.',
        alternative: 'Preacher Curl'
      },

      // ═══════════════ TRICEPS ═══════════════
      {
        name: 'Close Grip Bench Press', muscleGroup: 'triceps', subGroup: 'Long Head', difficulty: 'Intermediate', equipmentType: 'barbell',
        description: 'A bench press with a narrow grip that shifts the emphasis from chest to triceps.',
        tips: 'Grip about shoulder-width apart. Keep elbows tucked close to your body throughout the movement.',
        alternative: 'Dips'
      },
      {
        name: 'Dips', muscleGroup: 'triceps', subGroup: 'Long Head', difficulty: 'Intermediate', equipmentType: 'bodyweight',
        description: 'A bodyweight compound exercise performed on parallel bars, targeting all three tricep heads.',
        tips: 'Lean slightly forward for chest, stay upright for more tricep focus. Control the descent.',
        alternative: 'Close Grip Bench Press'
      },
      {
        name: 'Tricep Pushdown', muscleGroup: 'triceps', subGroup: 'Lateral Head', difficulty: 'Beginner', equipmentType: 'cable',
        description: 'A cable isolation movement. Push the bar or rope downward by extending your elbows.',
        tips: 'Keep your upper arms stationary and elbows tight to your body. Fully extend and squeeze at the bottom.',
        alternative: 'Overhead Tricep Extension'
      },
      {
        name: 'Overhead Tricep Extension', muscleGroup: 'triceps', subGroup: 'Long Head', difficulty: 'Intermediate', equipmentType: 'dumbbell',
        description: 'Hold a dumbbell or cable overhead and extend your arms by straightening your elbows.',
        tips: 'Keep your elbows pointing forward, not flaring out. Lower the weight behind your head with control.',
        alternative: 'Skull Crushers'
      },
      {
        name: 'Skull Crushers', muscleGroup: 'triceps', subGroup: 'Medial Head', difficulty: 'Intermediate', equipmentType: 'barbell',
        description: 'Lie on a bench and lower a barbell or EZ bar toward your forehead, then extend back up.',
        tips: 'Use an EZ bar for wrist comfort. Lower to just above your forehead and avoid flaring your elbows.',
        alternative: 'Tricep Pushdown'
      },
      {
        name: 'Diamond Push-ups', muscleGroup: 'triceps', subGroup: 'Medial Head', difficulty: 'Beginner', equipmentType: 'bodyweight',
        description: 'A push-up variation with hands placed close together in a diamond shape under your chest.',
        tips: 'Keep your elbows close to your body. If it\'s too hard, start on your knees.',
        alternative: 'Tricep Pushdown'
      },

      // ═══════════════ LEGS ═══════════════
      {
        name: 'Barbell Squat', muscleGroup: 'legs', subGroup: 'Quads', difficulty: 'Intermediate', equipmentType: 'barbell',
        description: 'The king of leg exercises. Place a barbell on your upper back and squat down until your thighs are parallel.',
        tips: 'Keep your chest up and knees tracking over your toes. Brace your core and push through your heels.',
        alternative: 'Leg Press'
      },
      {
        name: 'Leg Press', muscleGroup: 'legs', subGroup: 'Quads', difficulty: 'Beginner', equipmentType: 'machine',
        description: 'A machine-based compound exercise where you push a weighted platform away with your legs.',
        tips: 'Place feet shoulder-width apart, mid-platform. Don\'t lock your knees at the top. Control the descent.',
        alternative: 'Barbell Squat'
      },
      {
        name: 'Romanian Deadlift', muscleGroup: 'legs', subGroup: 'Hamstrings', difficulty: 'Advanced', equipmentType: 'barbell',
        description: 'A hip-hinge movement that primarily targets the hamstrings and glutes with a barbell.',
        tips: 'Keep the bar very close to your legs. Push your hips back, maintain a flat back. Feel the hamstring stretch.',
        alternative: 'Leg Curl'
      },
      {
        name: 'Leg Curl', muscleGroup: 'legs', subGroup: 'Hamstrings', difficulty: 'Beginner', equipmentType: 'machine',
        description: 'A machine isolation exercise that targets the hamstrings by curling a pad toward your glutes.',
        tips: 'Squeeze at the top and lower slowly. Don\'t let the weight stack slam at the bottom.',
        alternative: 'Romanian Deadlift'
      },
      {
        name: 'Leg Extension', muscleGroup: 'legs', subGroup: 'Quads', difficulty: 'Beginner', equipmentType: 'machine',
        description: 'A machine isolation exercise targeting the quadriceps by extending your knees against resistance.',
        tips: 'Squeeze the quads hard at the top. Use moderate weight and higher reps for joint protection.',
        alternative: 'Bulgarian Split Squat'
      },
      {
        name: 'Bulgarian Split Squat', muscleGroup: 'legs', subGroup: 'Quads', difficulty: 'Intermediate', equipmentType: 'dumbbell',
        description: 'A single-leg squat variation with rear foot elevated on a bench, targeting quads and glutes.',
        tips: 'Keep your torso upright. Step far enough forward so your front knee doesn\'t pass your toes.',
        alternative: 'Leg Extension'
      },
      {
        name: 'Standing Calf Raises', muscleGroup: 'legs', subGroup: 'Calves', difficulty: 'Beginner', equipmentType: 'machine',
        description: 'A calf exercise performed by rising up on your toes against resistance, targeting the gastrocnemius.',
        tips: 'Full range of motion — drop your heels below the platform and rise up as high as possible. Pause at top.',
        alternative: 'Seated Calf Raise'
      },
      {
        name: 'Seated Calf Raise', muscleGroup: 'legs', subGroup: 'Calves', difficulty: 'Beginner', equipmentType: 'machine',
        description: 'A calf exercise performed seated, which targets the soleus muscle underneath the gastrocnemius.',
        tips: 'Use a slower tempo with a full stretch at the bottom. This targets a different part of the calf than standing raises.',
        alternative: 'Standing Calf Raises'
      },
      {
        name: 'Hip Thrust', muscleGroup: 'legs', subGroup: 'Glutes', difficulty: 'Intermediate', equipmentType: 'barbell',
        description: 'Lean your upper back against a bench and drive a barbell upward by squeezing your glutes.',
        tips: 'Push through your heels. At the top, your shins should be vertical. Squeeze glutes hard for 1-2 seconds.',
        alternative: 'Glute Bridge'
      },
      {
        name: 'Lunges', muscleGroup: 'legs', subGroup: 'Quads', difficulty: 'Beginner', equipmentType: 'dumbbell',
        description: 'Step forward into a split-stance position and lower your back knee toward the floor, then push back up.',
        tips: 'Take a long enough stride. Keep your torso upright and front knee aligned with your ankle.',
        alternative: 'Bulgarian Split Squat'
      },

      // ═══════════════ ABS ═══════════════
      {
        name: 'Crunches', muscleGroup: 'abs', subGroup: 'Upper Abs', difficulty: 'Beginner', equipmentType: 'bodyweight',
        description: 'The classic ab exercise. Lie on your back and curl your shoulders off the floor by contracting your abs.',
        tips: 'Don\'t pull on your neck. Focus on curling your ribcage toward your pelvis. Exhale at the top.',
        alternative: 'Cable Crunch'
      },
      {
        name: 'Cable Crunch', muscleGroup: 'abs', subGroup: 'Upper Abs', difficulty: 'Intermediate', equipmentType: 'cable',
        description: 'Kneel facing a cable machine and crunch downward against resistance for progressive overload on abs.',
        tips: 'Keep your hips stationary — the movement comes from your spine curling, not your hips bending.',
        alternative: 'Crunches'
      },
      {
        name: 'Hanging Leg Raise', muscleGroup: 'abs', subGroup: 'Lower Abs', difficulty: 'Advanced', equipmentType: 'bodyweight',
        description: 'Hang from a pull-up bar and raise your legs to target the lower abdominals.',
        tips: 'Avoid swinging. Raise your legs slowly, curling your pelvis upward at the top for maximum lower ab activation.',
        alternative: 'Lying Leg Raise'
      },
      {
        name: 'Lying Leg Raise', muscleGroup: 'abs', subGroup: 'Lower Abs', difficulty: 'Beginner', equipmentType: 'bodyweight',
        description: 'Lie flat and raise your legs to 90 degrees, then lower them slowly without touching the floor.',
        tips: 'Press your lower back into the floor. If it\'s too hard, bend your knees slightly.',
        alternative: 'Hanging Leg Raise'
      },
      {
        name: 'Russian Twist', muscleGroup: 'abs', subGroup: 'Obliques', difficulty: 'Intermediate', equipmentType: 'bodyweight',
        description: 'Sit with knees bent and lean back slightly. Rotate your torso side to side to target the obliques.',
        tips: 'Keep your core engaged throughout. For added difficulty, hold a weight plate or medicine ball.',
        alternative: 'Bicycle Crunches'
      },
      {
        name: 'Bicycle Crunches', muscleGroup: 'abs', subGroup: 'Obliques', difficulty: 'Beginner', equipmentType: 'bodyweight',
        description: 'A twisting crunch where you bring opposite elbow to knee in a pedaling motion.',
        tips: 'Slow and controlled — don\'t rush. Touch your elbow to the opposite knee and fully extend the other leg.',
        alternative: 'Russian Twist'
      },
      {
        name: 'Plank', muscleGroup: 'abs', subGroup: 'Core', difficulty: 'Beginner', equipmentType: 'bodyweight',
        description: 'An isometric exercise. Hold a push-up position on your forearms to build core stability and endurance.',
        tips: 'Keep a straight line from head to heels. Squeeze your glutes, brace your abs, breathe normally.',
        alternative: 'Dead Bug'
      },
      {
        name: 'Ab Wheel Rollout', muscleGroup: 'abs', subGroup: 'Core', difficulty: 'Advanced', equipmentType: 'bodyweight',
        description: 'Kneel and roll an ab wheel forward, extending your body, then roll back using your abs.',
        tips: 'Don\'t let your hips sag. Start with short rollouts and gradually increase the range as you get stronger.',
        alternative: 'Plank'
      },
    ];

    await Exercise.insertMany(exercises);
    console.log(`✅ ${exercises.length} exercises seeded successfully!`);
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedExercises();
