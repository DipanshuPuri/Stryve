import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

// BMR Gauge Component — semicircular meter
function BMRGauge({ value, min = 1000, max = 3500 }) {
  const clamped = Math.max(min, Math.min(max, value));
  const pct = (clamped - min) / (max - min);
  const angle = -90 + pct * 180; // -90 to 90 degrees
  const r = 80;
  const cx = 100;
  const cy = 95;

  // Arc path for the gauge background
  const arcPath = (startAngle, endAngle) => {
    const s = ((startAngle - 90) * Math.PI) / 180;
    const e = ((endAngle - 90) * Math.PI) / 180;
    const x1 = cx + r * Math.cos(s);
    const y1 = cy + r * Math.sin(s);
    const x2 = cx + r * Math.cos(e);
    const y2 = cy + r * Math.sin(e);
    const large = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };

  // Needle endpoint
  const needleAngle = ((angle - 90) * Math.PI) / 180;
  const nx = cx + (r - 15) * Math.cos(needleAngle);
  const ny = cy + (r - 15) * Math.sin(needleAngle);

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 120" className="w-full max-w-[260px]">
        {/* Background arc segments */}
        <path d={arcPath(-90, -30)} fill="none" stroke="#ef4444" strokeWidth="10" strokeLinecap="round" opacity="0.3" />
        <path d={arcPath(-30, 30)} fill="none" stroke="#eab308" strokeWidth="10" strokeLinecap="round" opacity="0.3" />
        <path d={arcPath(30, 90)} fill="none" stroke="#22c55e" strokeWidth="10" strokeLinecap="round" opacity="0.3" />

        {/* Active arc up to current value */}
        <path
          d={arcPath(-90, angle)}
          fill="none"
          stroke={pct < 0.33 ? '#ef4444' : pct < 0.66 ? '#eab308' : '#22c55e'}
          strokeWidth="10"
          strokeLinecap="round"
        />

        {/* Needle */}
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="5" fill="white" />

        {/* Labels */}
        <text x="15" y="105" fill="#6b7280" fontSize="9" fontWeight="700">Low</text>
        <text x="88" y="15" fill="#6b7280" fontSize="9" fontWeight="700">Average</text>
        <text x="168" y="105" fill="#6b7280" fontSize="9" fontWeight="700">High</text>
      </svg>
      <div className="text-center -mt-2">
        <span className="text-4xl font-black text-white">{Math.round(value)}</span>
        <span className="text-sm text-gray-500 ml-1 font-bold">kcal/day</span>
      </div>
    </div>
  );
}

export default function Profile() {
  const { user, updateSession } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    weight: user?.weight || '',
    height: user?.height || '',
    goal: user?.goal || ''
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  // BMI Calculation
  const heightM = Number(formData.height) / 100;
  const bmi = formData.weight && formData.height ? (Number(formData.weight) / (heightM * heightM)).toFixed(1) : 0;
  let bmiColor = 'text-green-400';
  let bmiStatus = 'Normal';
  if (bmi > 0 && bmi < 18.5) { bmiStatus = 'Underweight'; bmiColor = 'text-blue-400'; }
  else if (bmi > 25 && bmi <= 30) { bmiStatus = 'Overweight'; bmiColor = 'text-orange-400'; }
  else if (bmi > 30) { bmiStatus = 'Obese'; bmiColor = 'text-red-400'; }

  // BMR Calculation (Mifflin-St Jeor — assumes male for now)
  const age = user?.age || 25;
  const bmr = formData.weight && formData.height
    ? (10 * Number(formData.weight)) + (6.25 * Number(formData.height)) - (5 * age) + 5
    : 0;

  // TDEE estimate (moderate activity)
  const tdee = Math.round(bmr * 1.55);

  // Goal-based recommendations
  const getRecommendation = () => {
    const goal = formData.goal || 'Maintain Health';
    if (goal === 'Build Muscle') {
      return {
        cals: `${tdee + 300} - ${tdee + 500} kcal/day`,
        advice: 'You need a caloric surplus to build muscle. Eat 300-500 calories above your TDEE, prioritize protein (1.6-2.2g per kg bodyweight), and train with progressive overload.',
        protein: `${Math.round(Number(formData.weight) * 2)}g`,
        color: 'text-blue-400'
      };
    } else if (goal === 'Lose Weight') {
      return {
        cals: `${tdee - 500} - ${tdee - 300} kcal/day`,
        advice: 'You need a caloric deficit to lose weight. Eat 300-500 calories below your TDEE. Keep protein high (1.8-2.2g per kg) to preserve muscle mass while cutting.',
        protein: `${Math.round(Number(formData.weight) * 2)}g`,
        color: 'text-orange-400'
      };
    } else if (goal === 'Improve Endurance') {
      return {
        cals: `${tdee} - ${tdee + 200} kcal/day`,
        advice: 'Eat at maintenance or a slight surplus. Focus on complex carbohydrates for sustained energy and adequate hydration. Protein should support recovery.',
        protein: `${Math.round(Number(formData.weight) * 1.4)}g`,
        color: 'text-cyan-400'
      };
    }
    return {
      cals: `${tdee} kcal/day`,
      advice: 'Eat at your maintenance level to sustain your current weight. Keep a balanced diet with adequate protein, healthy fats, and micronutrients.',
      protein: `${Math.round(Number(formData.weight) * 1.6)}g`,
      color: 'text-green-400'
    };
  };

  const rec = getRecommendation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    setError('');
    try {
      const { data } = await API.put('/auth/profile', formData);
      updateSession(data);
      setMsg('Profile updated successfully!');
      setTimeout(() => setMsg(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating profile');
    }
    setLoading(false);
  };

  return (
    <div className="w-full">
      <div className="max-w-5xl mx-auto pb-10">

        {/* Header */}
        <div className="mb-8 animate-fade-in text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black mb-1">
              Profile & <span className="gradient-text">Health</span>
            </h1>
            <p className="text-gray-400">View your health metrics and update your personal information.</p>
          </div>
          <div className="flex gap-3 mt-4 sm:mt-0">
            <div className="glass px-4 py-2 rounded-xl border border-white/5 flex flex-col items-center">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Fitness Level</span>
              <span className="text-accent-cyan font-black tracking-wide uppercase">{user?.fitnessLevel || 'Beginner'}</span>
            </div>
          </div>
        </div>

        {/* Notifications */}
        {msg && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-2xl flex items-center justify-center gap-2 animate-slide-up">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            <span className="font-bold">{msg}</span>
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-center">{error}</div>
        )}

        {/* ═══ BMR & Health Section ═══ */}
        <div className="glass p-8 rounded-3xl animate-slide-up border border-white/5 mb-8">
          <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
            <svg className="w-5 h-5 text-accent-violet" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Your Metabolic Profile
          </h2>
          <p className="text-sm text-gray-400 mb-6">Based on the Mifflin-St Jeor equation using your age, weight, and height.</p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* BMR Gauge */}
            <div className="flex flex-col items-center justify-center">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Basal Metabolic Rate</p>
              <BMRGauge value={bmr} />
              <p className="text-xs text-gray-500 mt-2 text-center max-w-[200px]">
                This is the number of calories your body burns at complete rest just to keep you alive.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="space-y-3">
              <div className="bg-dark-800/50 rounded-xl p-4 border border-white/5">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Daily Calorie Target</p>
                <p className={`text-lg font-black ${rec.color}`}>{rec.cals}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">For your goal: {formData.goal || 'Maintain'}</p>
              </div>
              <div className="bg-dark-800/50 rounded-xl p-4 border border-white/5">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Estimated TDEE</p>
                <p className="text-lg font-black text-white">{tdee} <span className="text-sm text-gray-500 font-medium">kcal/day</span></p>
                <p className="text-[10px] text-gray-500 mt-0.5">With moderate activity (3-5 days/week)</p>
              </div>
              <div className="bg-dark-800/50 rounded-xl p-4 border border-white/5">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Recommended Protein</p>
                <p className="text-lg font-black text-accent-cyan">{rec.protein}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Per day based on your bodyweight</p>
              </div>
            </div>

            {/* Recommendation */}
            <div className="bg-accent-violet/5 border border-accent-violet/10 rounded-xl p-5 flex flex-col">
              <p className="text-[10px] font-bold text-accent-violet uppercase tracking-widest mb-2">📋 Recommendation</p>
              <p className="text-sm text-gray-300 leading-relaxed flex-1">{rec.advice}</p>
              <div className="mt-4 pt-3 border-t border-white/5">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Your BMI</p>
                <div className="flex items-center gap-2">
                  <span className={`text-2xl font-black ${bmiColor}`}>{bmi}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-dark-800 border border-white/5 ${bmiColor}`}>
                    {bmiStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ Profile Form ═══ */}
        <div className="glass p-8 rounded-3xl animate-slide-up border border-white/5 animation-delay-200">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-accent-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            Personal Information
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="input-field" required />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email</label>
                <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="input-field opacity-60 cursor-not-allowed" disabled />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Weight (kg)</label>
                <input type="number" step="0.1" value={formData.weight} onChange={e => setFormData({ ...formData, weight: e.target.value })} className="input-field" required />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Height (cm)</label>
                <input type="number" value={formData.height} onChange={e => setFormData({ ...formData, height: e.target.value })} className="input-field" required />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Primary Goal</label>
                <select value={formData.goal} onChange={e => setFormData({ ...formData, goal: e.target.value })} className="input-field appearance-none" required>
                  <option>Build Muscle</option>
                  <option>Lose Weight</option>
                  <option>Improve Endurance</option>
                  <option>Maintain Health</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex justify-end">
              <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto px-8">
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
