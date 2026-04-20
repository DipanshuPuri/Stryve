import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../api/axios';

// Equipment type icons
const equipIcons = {
  barbell: '🏋️',
  dumbbell: '💪',
  cable: '🔗',
  machine: '⚙️',
  bodyweight: '🤸',
  band: '🎗️',
};

export default function Workouts() {
  const [exercises, setExercises] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loggingEx, setLoggingEx] = useState(null);
  const [logForm, setLogForm] = useState({ sets: 3, reps: 10, weight: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [expandedEx, setExpandedEx] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const targetMuscle = params.get('target') || 'chest';

  const muscleGroups = ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'legs', 'abs'];

  // Muscle scores for priority markers (would come from a shared context/API in production)
  const muscleScores = { chest: 25, shoulders: 45, back: 60, abs: 80, legs: 95, biceps: 35, triceps: 15 };
  const currentScore = muscleScores[targetMuscle] || 50;
  const isPriority = currentScore <= 50;

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await API.get(`/exercises/${targetMuscle}`);
        setExercises(data);
      } catch (err) {
        setError('Failed to load exercises. Please try again.');
      }
      setLoading(false);
    };
    fetchExercises();
    setLoggingEx(null);
    setExpandedEx(null);
  }, [targetMuscle]);

  const handleMuscleSelect = (muscle) => navigate(`/workouts?target=${muscle}`);

  const submitLog = async (e, exerciseName) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await API.post('/workout/log', {
        exercise: exerciseName,
        sets: Number(logForm.sets),
        reps: Number(logForm.reps),
        weight: Number(logForm.weight),
      });
      setLoggingEx(null);
      setSuccessMsg(`Successfully logged ${exerciseName}!`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      alert('Failed to log workout.');
    }
    setIsSubmitting(false);
  };

  const scrollToExercise = (altName) => {
    const el = document.getElementById(`ex-${altName.replace(/\s+/g, '-').toLowerCase()}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto pb-10">
        {/* Header */}
        <div className="mb-8 animate-fade-in text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-black mb-2 capitalize">
            <span className="gradient-text">{targetMuscle}</span> Exercises
          </h1>
          <p className="text-gray-400 mb-6">Browse exercises by muscle group. Log your sets and track progress.</p>

          <div className="flex flex-wrap gap-2">
            {muscleGroups.map(muscle => {
              const score = muscleScores[muscle] || 50;
              const needsFocus = score <= 50;
              return (
                <button
                  key={muscle}
                  onClick={() => handleMuscleSelect(muscle)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all duration-300 flex items-center gap-1.5 ${
                    targetMuscle === muscle
                      ? 'bg-accent-violet text-white shadow-[0_0_12px_rgba(139,92,246,0.15)] border border-accent-violet'
                      : 'bg-dark-800 text-gray-400 hover:bg-dark-700 hover:text-white border border-white/5'
                  }`}
                >
                  {muscle}
                  {needsFocus && targetMuscle !== muscle && (
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Priority Banner */}
        {isPriority && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 animate-slide-up">
            <span className="text-2xl">⚡</span>
            <div>
              <p className="font-bold text-red-400 capitalize">Priority: {targetMuscle} needs attention</p>
              <p className="text-sm text-gray-400 mt-0.5">
                Your recovery score is {currentScore}/100. Focus on these exercises to bring this muscle group back up.
              </p>
            </div>
          </div>
        )}

        {/* Success Toast */}
        {successMsg && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-2xl flex items-center justify-center gap-2 animate-slide-up">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            <span className="font-bold">{successMsg}</span>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 border-2 border-accent-violet border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="p-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-center">{error}</div>
        ) : Object.keys(exercises).length === 0 ? (
          <div className="p-10 glass rounded-3xl text-center text-gray-400">No exercises found for this muscle group yet.</div>
        ) : (
          <div className="space-y-10 animate-slide-up">
            {Object.entries(exercises).map(([subGroup, exList]) => (
              <div key={subGroup} className="space-y-4">
                {/* Sub-group Header */}
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-white capitalize">{subGroup}</h2>
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 bg-white/5 text-gray-400 rounded-full border border-white/5">
                    {exList.length} exercises
                  </span>
                  <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent"></div>
                </div>

                {/* Exercise Cards — Vertical Stack */}
                <div className="space-y-3">
                  {exList.map(ex => {
                    const isExpanded = expandedEx === ex._id;
                    const isLogging = loggingEx === ex._id;

                    return (
                      <div
                        key={ex._id}
                        id={`ex-${ex.name.replace(/\s+/g, '-').toLowerCase()}`}
                        className={`glass rounded-2xl border transition-all duration-300 ${
                          isLogging ? 'border-accent-violet/30 shadow-[0_0_20px_rgba(139,92,246,0.06)]' : 'border-white/5 hover:border-white/10'
                        }`}
                      >
                        {/* Exercise Header Row */}
                        <div
                          className="flex items-center gap-4 p-5 cursor-pointer"
                          onClick={() => setExpandedEx(isExpanded ? null : ex._id)}
                        >
                          {/* Equipment Icon */}
                          <div className="w-10 h-10 rounded-xl bg-dark-800 border border-white/5 flex items-center justify-center text-lg shrink-0">
                            {equipIcons[ex.equipmentType] || '🏋️'}
                          </div>

                          {/* Name + Sub-info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-white text-base leading-tight">{ex.name}</h3>
                            <p className="text-xs text-gray-500 mt-0.5 capitalize">{ex.equipmentType} • {subGroup}</p>
                          </div>

                          {/* Difficulty Badge */}
                          {ex.difficulty === 'Beginner' ? (
                            <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg">Beginner</span>
                          ) : ex.difficulty === 'Intermediate' ? (
                            <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-lg">Intermediate</span>
                          ) : (
                            <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">Advanced</span>
                          )}

                          {/* Expand Arrow */}
                          <svg className={`w-4 h-4 text-gray-500 transition-transform duration-200 shrink-0 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>

                        {/* Expanded Content */}
                        {isExpanded && (
                          <div className="px-5 pb-5 pt-0 animate-fade-in space-y-4 border-t border-white/5">
                            {/* Description */}
                            {ex.description && (
                              <p className="text-sm text-gray-300 leading-relaxed pt-4">{ex.description}</p>
                            )}

                            {/* Tips */}
                            {ex.tips && (
                              <div className="bg-accent-cyan/5 border border-accent-cyan/10 rounded-xl p-3.5">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-accent-cyan mb-1">💡 Tip</p>
                                <p className="text-sm text-gray-400">{ex.tips}</p>
                              </div>
                            )}

                            {/* Defaults + Actions Row */}
                            <div className="flex flex-wrap items-center gap-3">
                              <div className="flex items-center gap-4 bg-dark-900/50 rounded-xl px-4 py-2.5 border border-white/5">
                                <div className="text-center">
                                  <p className="text-[9px] text-gray-500 font-bold uppercase">Sets</p>
                                  <p className="text-base font-black text-white">3</p>
                                </div>
                                <div className="w-px h-6 bg-white/10"></div>
                                <div className="text-center">
                                  <p className="text-[9px] text-gray-500 font-bold uppercase">Reps</p>
                                  <p className="text-base font-black text-white">8-12</p>
                                </div>
                              </div>

                              <button
                                onClick={(e) => { e.stopPropagation(); setLoggingEx(isLogging ? null : ex._id); setLogForm({ sets: 3, reps: 10, weight: 0 }); }}
                                className="btn-primary !text-xs !px-5 !py-2.5 font-bold flex items-center gap-1.5"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                Log Workout
                              </button>

                              {ex.alternative && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); scrollToExercise(ex.alternative); }}
                                  className="btn-outline !text-xs !px-4 !py-2.5 font-bold border-white/10 text-gray-400 hover:text-white flex items-center gap-1.5"
                                >
                                  🔄 Try: {ex.alternative}
                                </button>
                              )}
                            </div>

                            {/* Logging Form */}
                            {isLogging && (
                              <form onSubmit={(e) => submitLog(e, ex.name)} className="pt-3 border-t border-white/5 animate-fade-in">
                                <div className="grid grid-cols-3 gap-3 mb-4">
                                  <div>
                                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1 block text-center">Sets</label>
                                    <input type="number" min="1" max="20" value={logForm.sets} onChange={e => setLogForm({ ...logForm, sets: e.target.value })} className="input-field !p-2.5 text-center text-sm font-bold bg-dark-900" required />
                                  </div>
                                  <div>
                                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1 block text-center">Reps</label>
                                    <input type="number" min="1" max="100" value={logForm.reps} onChange={e => setLogForm({ ...logForm, reps: e.target.value })} className="input-field !p-2.5 text-center text-sm font-bold bg-dark-900" required />
                                  </div>
                                  <div>
                                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1 block text-center">kg</label>
                                    <input type="number" min="0" step="0.5" value={logForm.weight} onChange={e => setLogForm({ ...logForm, weight: e.target.value })} className="input-field !p-2.5 text-center text-sm font-bold bg-dark-900" required />
                                  </div>
                                </div>
                                <div className="flex gap-3">
                                  <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 !text-xs !py-2.5 font-black flex justify-center items-center">
                                    {isSubmitting ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : 'Save Log'}
                                  </button>
                                  <button type="button" onClick={() => setLoggingEx(null)} className="btn-outline flex-1 !text-xs !py-2.5 border-white/10 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400">
                                    Cancel
                                  </button>
                                </div>
                              </form>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
