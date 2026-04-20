import { Navigate, useNavigate, useLocation } from 'react-router-dom';
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
      <div className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between md:justify-end px-4 sm:px-8 bg-dark-900/80 backdrop-blur-md sticky top-0 z-20 shrink-0">
          <button 
            className="md:hidden p-2 -ml-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"
            onClick={() => setSidebarOpen(true)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-3 text-right">
              <div className="w-10 h-10 rounded-full bg-dark-700 flex items-center justify-center text-accent-violet border border-white/10 font-bold">
                {user.name.charAt(0)}
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-white leading-tight">{user.name}</p>
                <p className="text-xs text-gray-400 leading-tight">{user.goal}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="btn-outline !py-2 !px-5 text-sm flex items-center gap-2 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Logout
            </button>
          </div>
        </header>

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 relative">
          {/* Subtle background glow for the whole app area */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent-violet/5 rounded-full blur-[120px] pointer-events-none"></div>
          {children}
        </main>
      </div>
    </div>
  );
}
