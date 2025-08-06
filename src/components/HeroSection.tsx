import { Button } from "@/components/ui/button";
import heroMountains from "@/assets/hero-mountains.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      
      {/* Mountain background image */}
      <div className="absolute inset-0" style={{
        backgroundImage: `url(${heroMountains})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center bottom',
        backgroundRepeat: 'no-repeat'
      }}></div>
      
      {/* ADDED: Dark overlay to create the "dark look" */}
      <div className="absolute inset-0 bg-black/75"></div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left side - Main content */}
          <div className="text-center lg:text-left space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Want to Acquire a Business?{" "}
              <span className="block">We'll Fund You!</span>
            </h1>
            
            {/* UPDATED: Button with new style */}
            <button
              className="group bg-white rounded-full px-6 py-3 inline-flex items-center justify-between text-base font-bold transition-transform hover:scale-105"
              onClick={() => window.open('https://tinyurl.com/2kwan9vz', '_blank')}
            >
              <span className="text-purple-600 tracking-wider">SET UP A MEETING NOW</span>
              <span className="ml-4 bg-purple-600 rounded-full p-2 inline-flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path>
                </svg>
              </span>
            </button>
          </div>
          
          {/* Right side - Stats and description */}
          <div className="text-center lg:text-left space-y-8">
            <p className="text-lg leading-relaxed text-slate-300">
              At Passet, We back experienced operators with the capital, playbooks, and expert support needed to acquire and grow subscription-based mobile apps.
            </p>
            <div>
              <div className="text-6xl lg:text-8xl font-bold text-white">
                11M+
              </div>
              <p className="text-lg text-slate-300 mt-2">
                Our founders have scaled and sold mobile apps with 10M+ users.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;