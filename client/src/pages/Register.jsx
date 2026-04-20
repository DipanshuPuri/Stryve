import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    weight: '',
    height: '',
    goal: 'Build Muscle'
  });
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { register, error, loading, clearError, updateSession } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSuccess(false);

    if (formData.password !== formData.confirmPassword) {
      return setLocalError('Passwords do not match');
    }

    try {
      const data = await register(
        formData.name,
        formData.email,
        formData.password,
        Number(formData.age),
        Number(formData.weight),
        Number(formData.height),
        formData.goal
      );
      
      setSuccess(true);
      
      // Delay to show success message before establishing session and redirecting
      setTimeout(() => {
        updateSession(data);
        navigate('/onboarding');
      }, 2000);
      
    } catch (err) {
      // Error is handled by context state
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-dark-900 pt-28 pb-10">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent-violet/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-cyan/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-2xl glass p-10 rounded-3xl relative z-10 shadow-xl shadow-black/20 animate-fade-in border border-white/5">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-white tracking-tight">Create Account</h2>
          <p className="text-sm text-gray-400 mt-2">Fill in your information to get started.</p>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-sm font-bold text-center animate-bounce">
            Registration Successful! Preparing your engine...
          </div>
        )}

        {(localError || error) && !success && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm font-bold text-center">
            {localError || error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={`space-y-6 transition-opacity duration-500 ${success ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Full Name</label>
              <input type="text" name="name" className="input-field !py-3 text-sm" placeholder="John Doe" onChange={handleChange} required />
            </div>
            
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Email Address</label>
              <input type="email" name="email" className="input-field !py-3 text-sm" placeholder="name@company.com" onChange={handleChange} required />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Password</label>
              <input type="password" name="password" className="input-field !py-3 text-sm" placeholder="••••••••" onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Confirm Password</label>
              <input type="password" name="confirmPassword" className="input-field !py-3 text-sm" placeholder="••••••••" onChange={handleChange} required />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Age</label>
              <input type="number" name="age" className="input-field !py-3 text-sm" placeholder="25" min="12" max="100" onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Primary Goal</label>
              <select name="goal" className="input-field !py-3 text-sm appearance-none" onChange={handleChange} required>
                <option value="Build Muscle">Build Muscle</option>
                <option value="Lose Weight">Lose Weight</option>
                <option value="Improve Endurance">Improve Endurance</option>
                <option value="Maintain Health">Maintain Health</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Weight (kg)</label>
              <input type="number" name="weight" className="input-field !py-3 text-sm" placeholder="75" step="0.1" onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Height (cm)</label>
              <input type="number" name="height" className="input-field !py-3 text-sm" placeholder="175" onChange={handleChange} required />
            </div>
          </div>

          <button type="submit" disabled={loading || success} className="btn-primary w-full mt-4 !py-3.5 flex justify-center text-sm font-black tracking-wide">
            {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : 'Sign Up'}
          </button>
        </form>

        <p className="mt-10 text-center text-sm text-gray-400 font-medium pb-2">
          Already have an account? <Link to="/login" className="text-accent-cyan hover:text-white font-bold transition-colors">Log In</Link>
        </p>
      </div>
    </div>
  );
}
