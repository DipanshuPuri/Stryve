import { Navigate, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import Sidebar from './Sidebar';

export default function ProtectedRoute({ children }) {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="w-10 h-10 border-2 border-accent-violet border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.onboardingCompleted && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex bg-dark-900 w-full min-h-screen overflow-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* Main Content Area */}
      <div className="flex-1 md:ml-56 flex flex-col h-screen overflow-hidden relative">
        {/* Transparent Floating Header */}
        <header className="absolute top-0 right-0 left-0 h-16 flex items-center justify-between md:justify-end px-4 sm:px-6 bg-transparent z-20 pointer-events-none">
          
          <div className="flex items-center md:hidden pointer-events-auto">
            <button 
              className="p-1.5 -ml-1.5 mr-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"
              onClick={() => setSidebarOpen(true)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-lg bg-hero-gradient flex items-center justify-center">
                <span className="text-white font-black text-xs">S</span>
              </div>
              <span className="text-lg font-bold tracking-tight gradient-text">STRYVE</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 pointer-events-auto">
            {/* Clickable Profile Badge */}
            <Link to="/profile" className="hidden sm:flex items-center gap-2.5 text-right group hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center text-accent-violet border border-white/10 font-bold text-sm group-hover:border-accent-violet/50 transition-colors">
                {user.name.charAt(0)}
              </div>
              <div className="text-left">
                <p className="text-[13px] font-medium text-white leading-tight">{user.name}</p>
                <p className="text-[10px] text-gray-400 leading-tight">{user.goal}</p>
              </div>
            </Link>
            <button onClick={handleLogout} className="btn-outline !py-1.5 !px-4 text-xs font-bold flex items-center gap-1.5 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 transition-colors bg-dark-900/50 backdrop-blur-sm">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Logout
            </button>
          </div>
        </header>

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-4 pt-16 sm:p-6 sm:pt-16 relative">
          {/* Subtle background glow for the whole app area */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent-violet/5 rounded-full blur-[120px] pointer-events-none"></div>
          {children}
        </main>
      </div>
    </div>
  );
}
