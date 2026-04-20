import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

export default function Onboarding() {
  const { user, updateSession } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    frequency: 3,
    intensity: 'Medium',
    goals: [user?.goal || 'Build Muscle'],
    weakMuscles: []
  });

  const muscleOptions = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];

  const toggleMuscle = (m) => {
    setFormData(prev => ({
      ...prev,
      weakMuscles: prev.weakMuscles.includes(m) ? prev.weakMuscles.filter(x => x !== m) : [...prev.weakMuscles, m]
    }));
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data } = await API.post('/auth/onboarding', formData);
      updateSession(data);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      alert('Failed to complete onboarding');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-10">
      <div className="glass p-10 rounded-3xl animate-fade-in relative overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(139,92,246,0.07)]">
         
         <div className="mb-10 text-center">
            <h1 className="text-3xl font-black text-white mb-2">Let's Customize Your STRYVE</h1>
            <p className="text-gray-400">Answer a few questions to calibrate your fitness engine.</p>
            <div className="flex justify-center gap-2 mt-6">
               {[1,2,3].map(i => (
                 <div key={i} className={`h-1.5 w-10 rounded-full transition-colors ${step >= i ? 'bg-accent-violet shadow-[0_0_10px_rgba(139,92,246,0.25)]' : 'bg-white/10'}`}></div>
               ))}
            </div>
         </div>

         {step === 1 && (
           <div className="space-y-6 animate-slide-up">
              <div>
                 <label className="block text-sm font-bold text-gray-300 mb-4 uppercase tracking-widest text-center">Workouts Per Week?</label>
                 <div className="flex items-center justify-center gap-6">
                    <input 
                      type="range" 
                      min="1" max="7" 
                      value={formData.frequency} 
                      onChange={e => setFormData({...formData, frequency: Number(e.target.value)})}
                      className="w-full max-w-xs accent-accent-cyan"
                    />
                    <span className="text-4xl font-black text-white">{formData.frequency}</span>
                 </div>
              </div>

              <div className="pt-6">
                 <label className="block text-sm font-bold text-gray-300 mb-4 uppercase tracking-widest text-center">Intensity Level?</label>
                 <div className="grid grid-cols-3 gap-4">
                   {['Low', 'Medium', 'High'].map(lvl => (
                     <button
                       key={lvl}
                       onClick={() => setFormData({...formData, intensity: lvl})}
                       className={`py-3 rounded-xl font-bold transition-all ${
                         formData.intensity === lvl 
                         ? 'bg-accent-cyan text-dark-900 shadow-[0_0_15px_rgba(34,211,238,0.25)] border border-accent-cyan' 
                         : 'glass text-gray-400 hover:text-white border border-white/5'
                       }`}
                     >
                       {lvl}
                     </button>
                   ))}
                 </div>
              </div>
           </div>
         )}

         {step === 2 && (
           <div className="space-y-6 animate-slide-up">
              <div>
                 <label className="block text-sm font-bold text-gray-300 mb-4 uppercase tracking-widest text-center">Primary Goal?</label>
                 <div className="grid grid-cols-2 gap-4">
                   {['Build Muscle', 'Lose Weight', 'Improve Endurance', 'Maintain Health'].map(goal => (
                     <button
                       key={goal}
                       onClick={() => setFormData({...formData, goals: [goal]})}
                       className={`py-4 rounded-xl font-bold transition-all ${
                         formData.goals.includes(goal) 
                         ? 'bg-accent-violet text-white shadow-[0_0_15px_rgba(139,92,246,0.25)] border border-accent-violet' 
                         : 'glass text-gray-400 hover:text-white border border-white/5'
                       }`}
                     >
                       {goal}
                     </button>
                   ))}
                 </div>
              </div>
           </div>
         )}

         {step === 3 && (
           <div className="space-y-6 animate-slide-up">
              <div>
                 <label className="block text-sm font-bold text-gray-300 mb-4 uppercase tracking-widest text-center">Priority Focus Areas? (Optional)</label>
                 <div className="flex flex-wrap justify-center gap-3">
                   {muscleOptions.map(m => (
                     <button
                       key={m}
                       onClick={() => toggleMuscle(m)}
                       className={`px-5 py-2.5 rounded-full font-bold transition-all ${
                         formData.weakMuscles.includes(m)
                         ? 'bg-white text-dark-900 shadow-[0_0_15px_rgba(255,255,255,0.20)]' 
                         : 'glass text-gray-400 hover:text-white border border-white/5 hover:border-white/20'
                       }`}
                     >
                       {m}
                     </button>
                   ))}
                 </div>
              </div>
           </div>
         )}

         <div className="flex justify-between items-center mt-12 pt-6 border-t border-white/5">
            {step > 1 ? (
              <button onClick={handleBack} className="text-gray-400 hover:text-white font-bold px-4 py-2 transition-colors">
                Back
              </button>
            ) : <div></div>}
            
            {step < 3 ? (
              <button onClick={handleNext} className="btn-primary">
                Continue
              </button>
            ) : (
              <button 
                onClick={handleSubmit} 
                disabled={loading}
                className="btn-primary w-40 flex justify-center items-center font-black !bg-accent-cyan !text-dark-900 border !border-accent-cyan shadow-[0_0_20px_rgba(34,211,238,0.25)] hover:scale-105"
              >
                {loading ? <span className="w-5 h-5 border-2 border-dark-900 border-t-transparent rounded-full animate-spin"></span> : 'Launch STRYVE'}
              </button>
            )}
         </div>
      </div>
    </div>
  );
}
