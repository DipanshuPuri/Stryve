import { useState, useEffect } from 'react';
import API from '../api/axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await API.get('/analytics');
        setData(response.data);
      } catch (err) {
        console.error(err);
        const serverMsg = err.response?.data?.message || err.message;
        setError(`Failed to load telemetry data: ${serverMsg}`);
      }
      setLoading(false);
    }
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-accent-violet border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 sm:p-5">
        <div className="p-4 sm:p-5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-center">
          <p className="font-bold mb-1">Error Detected</p>
          <p className="text-sm opacity-80">{error || 'No analytics data available.'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl text-xs font-bold transition-colors"
          >
            Retry Analytics Engine
          </button>
        </div>
      </div>
    );
  }

  const { aiInsights } = data;

  // Parse Weight Data
  const weightLabels = (data.weightHistory || []).map(w => new Date(w.date).toLocaleDateString(undefined, {month:'short', day:'numeric'}));
  const weightPoints = (data.weightHistory || []).map(w => w.weight);

  const weightChartData = {
    labels: weightLabels.length ? weightLabels : ['No Data'],
    datasets: [{
      label: 'Body Weight (kg)',
      data: weightPoints.length ? weightPoints : [0],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderWidth: 3,
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#fff',
      pointRadius: 4,
    }]
  };

  // Parse Consistency Bar Data
  const consKeys = Object.keys(data.consistency || {}).sort();
  const consLabels = consKeys.map(k => {
     const parts = k.split('-');
     return parts.length >= 3 ? `${parts[1]}/${parts[2]}` : k;
  });
  const consVals = consKeys.map(k => data.consistency[k]);

  const consChartData = {
    labels: consLabels.length ? consLabels : ['No Activity'],
    datasets: [{
      label: 'Volume (Exercises Logged)',
      data: consVals.length ? consVals : [0],
      backgroundColor: '#8b5cf6',
      borderRadius: 6,
    }]
  };

  // Parse Muscle Focus Radar/Bar Data
  const muscleLabels = Object.keys(data.muscleTrends || {});
  const muscleVals = Object.values(data.muscleTrends || {});

  const muscleChartData = {
    labels: muscleLabels.length ? muscleLabels : ['Unknown'],
    datasets: [{
      label: 'Volume Load / Fatigue Marker',
      data: muscleVals.length ? muscleVals : [0],
      backgroundColor: ['#22d3ee', '#3b82f6', '#8b5cf6', '#eab308', '#ef4444'],
      borderRadius: 6,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#9ca3af', font: { family: 'Inter', weight: 'bold' } } }
    },
    scales: {
      y: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#6b7280' } },
      x: { grid: { display: false }, ticks: { color: '#6b7280' } }
    }
  };

  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto pb-4">

        {/* Header */}
        <div className="mb-4 animate-fade-in text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-black mb-1">
            Performance <span className="gradient-text">Telemetry</span>
          </h1>
          <p className="text-gray-400 text-sm">View computational analysis of your past inputs and trends.</p>
        </div>

        {/* AI Insight Summary Panel */}
        {aiInsights && (
          <div className="mb-6 relative group animate-slide-up">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-cyan/40 via-accent-violet/40 to-accent-cyan/40 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative glass-strong p-5 rounded-3xl border border-white/10 overflow-hidden">
               {/* Background AI Pulse Graphic */}
               <div className="absolute -top-16 -right-16 w-48 h-48 bg-accent-violet/10 rounded-full blur-[60px] animate-pulse"></div>
               
               <div className="flex flex-col lg:flex-row gap-5 items-start relative z-10">
                  <div className="shrink-0">
                     <div className="w-12 h-12 rounded-xl bg-hero-gradient flex items-center justify-center shadow-2xl shadow-violet-500/20 relative">
                        <div className="absolute inset-0 rounded-xl bg-white/10 animate-ping opacity-20"></div>
                        <svg className="w-6 h-6 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                     </div>
                  </div>

                  <div className="flex-1 space-y-3">
                     <div className="flex items-center gap-2">
                        <h2 className="text-sm font-black text-white uppercase tracking-wider">Cognitive Insight Engine</h2>
                        <span className="px-1.5 py-0.5 rounded text-[8px] font-black bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30 uppercase">Live Telemetry</span>
                     </div>
                     
                     <p className="text-sm font-medium text-gray-100 leading-relaxed max-w-4xl italic">
                        "{aiInsights.summary}"
                     </p>
                     
                     <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                           <p className="text-[9px] font-bold text-accent-violet uppercase tracking-widest mb-1.5">Machine Reflection</p>
                           <p className="text-[13px] text-gray-400 leading-relaxed font-medium">{aiInsights.reflection}</p>
                        </div>
                        <div className="flex gap-3 shrink-0 mt-3 sm:mt-0">
                           <div className="text-center bg-white/5 rounded-xl px-4 py-2 border border-white/5 min-w-[80px]">
                              <p className="text-[9px] text-gray-500 font-bold uppercase mb-1">Consistency</p>
                              <p className="text-lg font-black text-white">{aiInsights.consistencyScore}%</p>
                           </div>
                           <div className="text-center bg-white/5 rounded-xl px-4 py-2 border border-white/5 min-w-[80px]">
                              <p className="text-[9px] text-gray-500 font-bold uppercase mb-1">Status</p>
                              <p className="text-xs font-black text-accent-cyan uppercase">{aiInsights.status}</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-4 animate-slide-up animation-delay-200">

          {/* Line Chart: Weight Trajectory */}
          <div className="glass p-4 sm:p-5 rounded-2xl border border-white/5 relative group">
             <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-[40px] pointer-events-none"></div>
             <h2 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Weight Trajectory</h2>
             <div className="h-48 sm:h-64 w-full relative">
                {weightPoints.length > 0 ? (
                  <Line data={weightChartData} options={chartOptions} />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-500 uppercase">Insufficient Data</div>
                )}
             </div>
          </div>

          {/* Bar Chart: Daily Consistency Output */}
          <div className="glass p-4 sm:p-5 rounded-2xl border border-white/5 relative group animation-delay-400">
             <div className="absolute top-0 right-0 w-24 h-24 bg-accent-violet/10 rounded-full blur-[40px] pointer-events-none"></div>
             <h2 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Consistency Output</h2>
             <div className="h-48 sm:h-64 w-full relative">
                {consVals.length > 0 ? (
                   <Bar data={consChartData} options={chartOptions} />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-500 uppercase">Insufficient Data</div>
                )}
             </div>
          </div>

          {/* Bar Chart: Target Area Breakdown */}
          <div className="lg:col-span-2 glass p-4 sm:p-5 rounded-2xl border border-white/5 relative group animation-delay-600">
             <div className="absolute inset-x-0 bottom-0 h-24 bg-accent-cyan/5 rounded-t-full blur-[40px] pointer-events-none"></div>
             <h2 className="text-sm font-black text-white mb-4 uppercase tracking-wider text-center">Muscle Fatigue & Volume Flow</h2>
             <div className="h-56 sm:h-72 w-full relative">
                  {muscleVals.length > 0 ? (
                    <Bar 
                      data={muscleChartData} 
                      options={{...chartOptions, indexAxis: 'y'}} 
                    />
                  ) : (
                   <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-500 uppercase">Insufficient Data</div>
                 )}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
