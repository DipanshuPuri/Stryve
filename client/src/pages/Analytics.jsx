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
        setError('Failed to securely load telemetry data.');
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
      <div className="w-full max-w-4xl mx-auto p-8">
        <div className="p-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-center">
          {error || 'No analytics data available.'}
        </div>
      </div>
    );
  }

  // Parse Weight Data
  const weightLabels = data.weightHistory.map(w => new Date(w.date).toLocaleDateString(undefined, {month:'short', day:'numeric'}));
  const weightPoints = data.weightHistory.map(w => w.weight);

  const weightChartData = {
    labels: weightLabels.length ? weightLabels : ['No Data'],
    datasets: [{
      label: 'Body Weight (kg)',
      data: weightPoints.length ? weightPoints : [0],
      borderColor: '#3b82f6', // blue
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderWidth: 3,
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#fff',
      pointRadius: 4,
    }]
  };

  // Parse Consistency Bar Data
  const consKeys = Object.keys(data.consistency).sort();
  const consLabels = consKeys.map(k => {
     const [,m,d] = k.split('-');
     return `${m}/${d}`;
  });
  const consVals = consKeys.map(k => data.consistency[k]);

  const consChartData = {
    labels: consLabels.length ? consLabels : ['No Activity'],
    datasets: [{
      label: 'Volume (Exercises Logged)',
      data: consVals.length ? consVals : [0],
      backgroundColor: '#8b5cf6', // violet
      borderRadius: 6,
    }]
  };

  // Parse Muscle Focus Radar/Bar Data
  const muscleLabels = Object.keys(data.muscleTrends);
  const muscleVals = Object.values(data.muscleTrends);

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
      <div className="max-w-6xl mx-auto pb-10">

        {/* Header */}
        <div className="mb-8 animate-fade-in text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-black mb-1">
            Performance <span className="gradient-text">Telemetry</span>
          </h1>
          <p className="text-gray-400">View computational analysis of your past inputs and trends.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 animate-slide-up">

          {/* Line Chart: Weight Trajectory */}
          <div className="glass p-6 sm:p-8 rounded-3xl border border-white/5 relative group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none"></div>
             <h2 className="text-lg font-black text-white mb-6 uppercase tracking-wider">Weight Trajectory</h2>
             <div className="h-64 sm:h-80 w-full relative">
                {weightPoints.length > 0 ? (
                  <Line data={weightChartData} options={chartOptions} />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-500 uppercase">Insufficient Data</div>
                )}
             </div>
          </div>

          {/* Bar Chart: Daily Consistency Output */}
          <div className="glass p-6 sm:p-8 rounded-3xl border border-white/5 relative group animation-delay-200">
             <div className="absolute top-0 right-0 w-32 h-32 bg-accent-violet/10 rounded-full blur-[60px] pointer-events-none"></div>
             <h2 className="text-lg font-black text-white mb-6 uppercase tracking-wider">Consistency Output</h2>
             <div className="h-64 sm:h-80 w-full relative">
                {consVals.length > 0 ? (
                   <Bar data={consChartData} options={chartOptions} />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-500 uppercase">Insufficient Data</div>
                )}
             </div>
          </div>

          {/* Bar Chart: Target Area Breakdown */}
          <div className="lg:col-span-2 glass p-6 sm:p-8 rounded-3xl border border-white/5 relative group animation-delay-400">
             <div className="absolute inset-x-0 bottom-0 h-32 bg-accent-cyan/5 rounded-t-full blur-[60px] pointer-events-none"></div>
             <h2 className="text-lg font-black text-white mb-6 uppercase tracking-wider text-center">Muscle Fatigue & Volume Flow</h2>
             <div className="h-64 sm:h-96 w-full relative">
                 {muscleVals.length > 0 ? (
                   <Bar 
                     data={muscleChartData} 
                     options={{...chartOptions, indexAxis: 'y'}} // Horizontal logic looks better here
                   />
                 ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-500 uppercase">Insufficient Data</div>
                )}
             </div>
          </div>

        </div>

      </div>
    </div>
  );
}
