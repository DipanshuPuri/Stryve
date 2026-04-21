import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const showNavRoutes = ['/', '/login', '/register'];
  if (!showNavRoutes.includes(location.pathname)) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-hero-gradient flex items-center justify-center">
              <span className="text-white font-black text-sm">S</span>
            </div>
            <span className="text-2xl font-bold tracking-tight gradient-text">STRYVE</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-gray-300 hover:text-accent-violet transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-300 hover:text-accent-violet transition-colors">How it Works</a>
            <a href="#about" className="text-sm font-medium text-gray-300 hover:text-accent-violet transition-colors">About</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <Link to="/dashboard" className="btn-primary text-sm !px-6 !py-2.5">Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="btn-outline text-sm !px-6 !py-2.5">Login</Link>
                <Link to="/register" className="btn-primary text-sm !px-6 !py-2.5">Register</Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
