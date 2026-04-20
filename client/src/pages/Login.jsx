import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { login, error, loading, clearError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      // Error handled by context
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-dark-900 pt-24">
      {/* Background elements */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-accent-cyan/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="w-full max-w-md glass p-10 rounded-3xl relative z-10 shadow-xl shadow-black/20 animate-fade-in border border-white/5">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-white tracking-tight">Sign In</h2>
          <p className="text-sm text-gray-400 mt-2">Welcome back! Please enter your details.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field !py-3 text-sm" 
              placeholder="name@company.com" 
              required 
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field !py-3 text-sm" 
              placeholder="••••••••" 
              required 
            />
          </div>

          <div className="flex items-center justify-between mt-2">
             <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-dark-700/50 text-accent-violet focus:ring-accent-violet/30 focus:ring-offset-dark-900" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 group-hover:text-white transition-colors">Remember me</span>
             </label>
             <a href="#" className="text-[11px] font-bold uppercase tracking-wider text-accent-cyan hover:text-white transition-colors">Forgot key?</a>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full mt-2 !py-3.5 flex justify-center text-sm font-black tracking-wide">
            {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : 'Sign In'}
          </button>
        </form>

        <p className="mt-10 text-center text-sm text-gray-400 font-medium pb-2">
           Don't have an account? <Link to="/register" className="text-accent-violet hover:text-white font-bold transition-colors">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
