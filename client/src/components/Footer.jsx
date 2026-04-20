import { useAuth } from '../context/AuthContext';

export default function Footer() {
  const { user } = useAuth();

  if (user) return null;

  return (
    <footer className="border-t border-white/5 bg-dark-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-hero-gradient flex items-center justify-center">
              <span className="text-white font-black text-xs">S</span>
            </div>
            <span className="text-xl font-bold gradient-text">STRYVE</span>
          </div>
          <div className="text-sm text-gray-500 text-center md:text-right">
            <p>Stryve - Intelligent Workout System &copy; {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
