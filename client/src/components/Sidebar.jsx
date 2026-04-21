import { Link, useLocation } from 'react-router-dom';

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Workout', path: '/workouts', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { name: 'Nutrition', path: '/nutrition', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' },
    { name: 'Analytics', path: '/analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { name: 'Profile', path: '/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ];

  return (
    <div className={`fixed inset-y-0 left-0 z-40 w-56 bg-dark-800 border-r border-white/5 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="h-16 px-4 flex items-center justify-between border-b border-white/5">
        <Link to="/dashboard" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
          <div className="w-7 h-7 rounded-lg bg-hero-gradient flex items-center justify-center shadow-lg shadow-violet-500/10">
            <span className="text-white font-black text-xs">S</span>
          </div>
          <span className="text-lg font-bold tracking-tight gradient-text">STRYVE</span>
        </Link>
        <button className="md:hidden p-1.5 -mr-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5" onClick={() => setIsOpen(false)}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      
      <div className="flex flex-col h-[calc(100vh-4rem)] justify-between pb-4">
        <nav className="px-3 py-4 space-y-1">
          <p className="px-3 text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-3">Main Menu</p>
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link 
                key={item.name}
                to={item.path} 
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-white/10 text-white shadow-lg shadow-black/20 border border-white/5' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <svg className={`w-4 h-4 ${isActive ? 'text-accent-cyan' : 'opacity-70'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon}/></svg>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
