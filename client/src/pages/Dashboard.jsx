import { useAuth } from '../context/AuthContext';
import HumanBodyGraph from '../components/HumanBodyGraph';

export default function Dashboard() {
  const { user } = useAuth();

  // Dummy scores as requested
  const muscleScores = {
    chest: 25,     // 0-30 red
    shoulders: 45, // 30-50 orange
    back: 60,      // 50-70 yellow
    abs: 80,       // 70-85 green
    legs: 95,      // 85-100 blue
    biceps: 35,
    triceps: 15
  };

  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 animate-fade-in relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              Welcome back, <span className="gradient-text">{user?.name || 'Athlete'}</span>
            </h1>
            <p className="text-gray-400">Here is your muscle recovery and strain overview.</p>
          </div>
          
          {/* Legend */}
          <div className="flex bg-dark-800 p-4 rounded-2xl border border-white/5 space-x-4 shadow-xl">
            <LegendItem color="#ef4444" label="Strained" range="0-30" />
            <LegendItem color="#f97316" label="Fatigued" range="31-50" />
            <LegendItem color="#eab308" label="Moderate" range="51-70" />
            <LegendItem color="#22c55e" label="Good" range="71-85" />
            <LegendItem color="#3b82f6" label="Recovered" range="86-100" />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Visualization Area */}
          <div className="lg:col-span-2 glass-strong relative rounded-3xl overflow-hidden p-6 sm:p-8 animate-slide-up flex flex-col min-h-[500px]">
             <h2 className="text-xl font-bold mb-2">My Body Map</h2>
             <p className="text-sm text-gray-400 mb-8 max-w-lg">
               Interactive 2D visualization of your current physical state. Hover over a muscle group to view its recovery score, or click to jump into targeted workouts.
             </p>
             <div className="flex-1 w-full bg-dark-900/40 rounded-2xl flex items-center justify-center border border-white/5">
               <HumanBodyGraph scores={muscleScores} />
             </div>
          </div>
          
          {/* Priority Insights Sidebar */}
          <div className="space-y-6">
             <div className="glass p-6 rounded-3xl animate-slide-up animation-delay-200">
               <div className="flex items-center gap-2 mb-4">
                 <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                 <h3 className="font-bold text-lg">Focus Areas</h3>
               </div>
               <div className="space-y-4">
                 <FocusItem title="Triceps" score={15} message="Critical strain. Rest required." color="#ef4444" />
                 <FocusItem title="Chest" score={25} message="High fatigue. Light mobility only." color="#ef4444" />
                 <FocusItem title="Biceps" score={35} message="Moderate fatigue. Avoid heavy lifts." color="#f97316" />
               </div>
             </div>
             
             <div className="glass p-6 rounded-3xl animate-slide-up animation-delay-400">
               <div className="flex items-center gap-2 mb-4">
                 <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                 <h3 className="font-bold text-lg">Ready to Train</h3>
               </div>
               <div className="space-y-4">
                 <FocusItem title="Legs" score={95} message="Fully recovered. Prime for heavy squats." color="#3b82f6" />
                 <FocusItem title="Abs" score={80} message="Good condition. Ready for core work." color="#22c55e" />
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LegendItem({ color, label, range }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-4 h-4 rounded-full mb-1.5 shadow-[0_0_8px_rgba(255,255,255,0.05)]" style={{ backgroundColor: color }}></div>
      <span className="text-[10px] uppercase font-bold text-gray-300">{label}</span>
      <span className="text-[9px] text-gray-500 font-medium">{range}</span>
    </div>
  );
}

function FocusItem({ title, score, message, color }) {
  return (
    <div className="flex items-start gap-4 p-3.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
      <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0 shadow-inner overflow-hidden relative" style={{ backgroundColor: `${color}15`, border: `1px solid ${color}40` }}>
        <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity" style={{ backgroundColor: color }}></div>
        <span className="text-lg font-black relative z-10" style={{ color }}>{score}</span>
      </div>
      <div>
        <h4 className="font-bold text-white capitalize group-hover:text-accent-cyan transition-colors">{title}</h4>
        <p className="text-xs text-gray-400 mt-1 leading-snug">{message}</p>
      </div>
    </div>
  );
}
