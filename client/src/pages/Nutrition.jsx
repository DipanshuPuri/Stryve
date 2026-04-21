import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

export default function Nutrition() {
  const { user } = useAuth();
  const [nutrition, setNutrition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNutrition = async () => {
      try {
        const { data } = await API.post('/nutrition/calculate', {
          weight: user.weight,
          height: user.height,
          age: user.age,
          goal: user.goal || 'Build Muscle'
        });
        setNutrition(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load nutrition data. Make sure your profile has weight, height, and age set.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      if (!user.weight || !user.height || !user.age) {
        setLoading(false);
        setError('Please update your profile with weight, height, and age to formulate your nutrition plan.');
      } else {
        fetchNutrition();
      }
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 sm:p-5">
        <div className="p-4 sm:p-5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-center">
          {error}
        </div>
      </div>
    );
  }

  if (!nutrition) return null;

  const { calories, macros } = nutrition;
  const { protein, fat, carbs } = macros;
  
  // Calculate percentages for the CSS pie chart
  const totalGrams = protein + fat + carbs;
  const pPct = Math.round((protein / totalGrams) * 100);
  const fPct = Math.round((fat / totalGrams) * 100);
  const cPct = Math.round((carbs / totalGrams) * 100);

  // Pure CSS Pie Chart Visualization logic
  const conicString = `conic-gradient(
    #3b82f6 0% ${pPct}%, 
    #eab308 ${pPct}% ${pPct + fPct}%, 
    #ef4444 ${pPct + fPct}% 100%
  )`;

  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto pb-4">
        
        {/* Header */}
        <div className="mb-4 animate-fade-in relative z-10 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-black mb-1">
            My <span className="gradient-text">Nutrition</span>
          </h1>
          <p className="text-gray-400 text-sm">Target daily intake algorithmically customized for your goal: <span className="text-white capitalize">{user.goal}</span></p>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          
          {/* Daily Macros Visualization Panel */}
          <div className="lg:col-span-1 space-y-4">
            <div className="glass p-5 sm:p-6 rounded-2xl text-center animate-slide-up flex flex-col items-center">
               <h2 className="text-xs font-bold mb-4 text-gray-300 uppercase tracking-widest">Daily Target</h2>
               
               {/* Custom CSS Chart Graphic */}
               <div className="mb-6 relative w-48 h-48 rounded-full flex items-center justify-center p-3 shadow-[0_0_30px_rgba(34,211,238,0.05)]" style={{ background: conicString }}>
                  <div className="w-full h-full bg-dark-800 rounded-full flex flex-col items-center justify-center shadow-inner relative z-10">
                     <span className="text-3xl font-black text-white">{calories}</span>
                     <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">kcal</span>
                  </div>
               </div>
               
               {/* Legend & Gram Readouts */}
               <div className="w-full space-y-2">
                 <MacroStat label="Protein" grams={protein} color="bg-blue-500" percent={pPct} />
                 <MacroStat label="Fats" grams={fat} color="bg-yellow-500" percent={fPct} />
                 <MacroStat label="Carbs" grams={carbs} color="bg-red-500" percent={cPct} />
               </div>
            </div>
          </div>

          {/* Meal Suggestions Layout Grid */}
          <div className="lg:col-span-2 space-y-4 animate-slide-up animation-delay-200">
             <div className="flex items-center gap-2 mb-1">
               <div className="w-2 h-2 rounded-full bg-accent-cyan shadow-[0_0_10px_rgba(34,211,238,0.25)]"></div>
               <h2 className="text-lg font-bold text-white">Suggested Meal Plan Builder</h2>
             </div>
             
             <div className="grid sm:grid-cols-2 gap-4">
               <MealCard 
                 title="Breakfast" 
                 time="08:00 AM" 
                 calories={Math.round(calories * 0.25)} 
                 items={['Oatmeal with fresh berries', '2x Scrambled cage-free eggs', 'Whey Protein Shake']} 
                 icon="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
               />
               <MealCard 
                 title="Pre-Workout" 
                 time="01:00 PM" 
                 calories={Math.round(calories * 0.15)} 
                 items={['Rice cakes', 'Organic peanut butter', 'Whole Banana']} 
                 icon="M13 10V3L4 14h7v7l9-11h-7z"
               />
               <MealCard 
                 title="Lunch" 
                 time="03:00 PM" 
                 calories={Math.round(calories * 0.35)} 
                 items={['Grilled chicken breast', 'Jasmine brown rice', 'Steamed broccoli']} 
                 icon="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z"
               />
               <MealCard 
                 title="Dinner" 
                 time="08:00 PM" 
                 calories={Math.round(calories * 0.25)} 
                 items={['Baked Wild Salmon fillet', 'Sweet potato pureé', 'Roasted Asparagus']} 
                 icon="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
               />
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function MacroStat({ label, grams, color, percent }) {
  return (
    <div className="flex items-center justify-between w-full p-3 rounded-xl bg-dark-900/70 border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${color}`}></div>
      <div className="flex items-center gap-2 pl-2">
        <h4 className="font-bold text-gray-300 uppercase text-[10px] tracking-wider">{label}</h4>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-base font-black text-white">{grams}g</span>
        <span className="text-[9px] font-bold text-gray-500 w-7 text-right bg-dark-800 px-1.5 py-0.5 rounded text-center">{percent}%</span>
      </div>
    </div>
  );
}

function MealCard({ title, time, items, calories, icon }) {
  return (
    <div className="glass p-4 sm:p-5 rounded-2xl hover:-translate-y-1 transition-all duration-300 border border-white/5 flex flex-col group hover:shadow-2xl hover:shadow-cyan-500/5">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-dark-800 flex items-center justify-center text-accent-cyan border border-white/10 shadow-inner group-hover:scale-110 group-hover:bg-accent-cyan group-hover:text-dark-900 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} /></svg>
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">{title}</h3>
            <p className="text-[10px] font-bold text-accent-violet tracking-wide">~{calories} kcal alloc.</p>
          </div>
        </div>
        <span className="text-[9px] font-black tracking-widest uppercase text-gray-400 bg-dark-900 border border-white/5 px-2 py-1 rounded-lg">{time}</span>
      </div>
      
      <div className="bg-dark-900/50 rounded-xl p-3 mt-auto border border-white/5">
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
              <div className="w-1 h-1 rounded-full bg-accent-cyan/80 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(34,211,238,0.30)]"></div>
              <span className="leading-tight">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
