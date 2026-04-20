import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="w-full flex-1">
      {/* Hero Panel */}
      <section className="min-h-screen relative flex items-center pt-20 pb-16 overflow-hidden">
        {/* Abstract Glow Background */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-violet/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-cyan/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen animate-float animation-delay-400"></div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 w-full z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-slide-up text-center lg:text-left">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight tracking-tight">
              Train <span className="text-white">Smarter.</span><br />
              Not <span className="gradient-text">Harder.</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
              An advanced computational workout and nutrition system calibrating your fitness potential entirely. 
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <Link to="/register" className="btn-primary flex items-center justify-center min-w-[160px]">
                Get Started
              </Link>
              <Link to="/login" className="btn-outline flex items-center justify-center min-w-[160px]">
                Login
              </Link>
            </div>
            
            <div className="pt-8 flex items-center justify-center lg:justify-start gap-6 text-sm font-bold text-gray-500 uppercase tracking-widest">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse"></div>
                 Data Driven
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-accent-violet animate-pulse animation-delay-200"></div>
                 Algorithm Optimized
              </div>
            </div>
          </div>
          <div className="relative animate-fade-in flex justify-center items-center">
             <div className="absolute inset-0 bg-hero-gradient opacity-10 blur-[80px] rounded-full"></div>
             <img 
               src="/images/hero-body.png" 
               alt="Digital Human Body" 
               className="w-full max-w-sm sm:max-w-md lg:max-w-lg relative z-10 drop-shadow-[0_0_30px_rgba(124,58,237,0.07)]"
               onError={(e) => {
                 e.target.onerror = null; 
                 e.target.src = "https://via.placeholder.com/600x800/0a0a0f/7c3aed?text=STRYVE+Engine";
               }}
             />
          </div>
        </div>
      </section>

      {/* Feature Panel 1: Muscle Graph */}
      <section className="min-h-[80vh] relative flex items-center py-16 bg-dark-800/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 w-full grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 relative flex justify-center card-hover glass p-6">
             <div className="absolute inset-0 bg-accent-cyan/5 blur-[50px] rounded-3xl"></div>
             <img 
               src="/images/muscle-graph.png" 
               alt="Muscle Mapping Visualization" 
               className="w-full max-w-md relative z-10 rounded-2xl"
               onError={(e) => {
                 e.target.onerror = null; 
                 e.target.src = "https://via.placeholder.com/500x500/1a1a2e/06b6d4?text=Muscle+Mapping";
               }}
             />
          </div>
          <div className="order-1 lg:order-2 space-y-6 text-center lg:text-left">
            <h2 className="text-4xl font-black">Visualize <span className="text-accent-cyan tracking-tight">Muscle Growth</span></h2>
            <p className="text-gray-400 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Our dynamic 2D body graphing maps specific recovery and fatigue states natively. We color code exhaustion from Green (Peak) to Red (Critical) to inform your daily architecture.
            </p>
            <ul className="space-y-4 max-w-md mx-auto lg:mx-0 text-left pt-2">
              <li className="flex items-center gap-3">
                 <span className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center font-bold text-xs">85+</span>
                 <span className="text-gray-300 text-sm">Primed for growth load limit.</span>
              </li>
              <li className="flex items-center gap-3">
                 <span className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xs">50+</span>
                 <span className="text-gray-300 text-sm">Moderate volume tolerance.</span>
              </li>
              <li className="flex items-center gap-3">
                 <span className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center font-bold text-xs">&lt;30</span>
                 <span className="text-gray-300 text-sm">High fatigue density. Rest recommended.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Feature Panel 2: Nutrition & Logic */}
      <section className="min-h-[80vh] relative flex items-center py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 w-full grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <h2 className="text-4xl font-black">Precision <span className="text-accent-violet tracking-tight">Nutrition</span></h2>
            <p className="text-gray-400 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Using the Mifflin-St Jeor engine variables, the system executes daily macro arrays perfectly mapped against your profile, goal, and output.
            </p>
          </div>
          <div className="relative flex justify-center card-hover glass p-6">
             <div className="absolute inset-0 bg-accent-violet/5 blur-[50px] rounded-3xl"></div>
             <img 
               src="/images/nutrition-split.png" 
               alt="Nutrition Panel" 
               className="w-full max-w-md relative z-10 rounded-2xl"
               onError={(e) => {
                 e.target.onerror = null; 
                 e.target.src = "https://via.placeholder.com/500x500/1a1a2e/7c3aed?text=Macro+Calculations";
               }}
             />
          </div>
        </div>
      </section>

      {/* Final Action Section */}
      <section className="py-24 relative overflow-hidden bg-dark-800 border-t border-white/5">
         <div className="absolute inset-0 bg-hero-gradient opacity-[0.03]"></div>
         <div className="max-w-3xl mx-auto px-6 sm:px-8 text-center relative z-10">
            <h2 className="text-4xl sm:text-5xl font-black mb-6">Ready to join <span className="gradient-text">Stryve?</span></h2>
            <p className="text-gray-400 mb-10 max-w-xl mx-auto">Skip the assumptions. Input your dimensions and we will map the trajectory.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register" className="btn-primary">
                Create Account
              </Link>
              <Link to="/login" className="btn-outline">
                Sign In
              </Link>
            </div>
         </div>
      </section>
    </div>
  );
}
