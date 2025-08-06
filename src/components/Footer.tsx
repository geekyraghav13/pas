import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-dark-bg py-16">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-8">
          {/* Logo and Title */}
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Passet.vc
            </h2>
            <p className="text-xl text-white/80 max-w-md mx-auto">
              We Help Entrepreneurs Acquire Internet Businesses.
            </p>
          </div>
          
          {/* CTA Button */}
          <Button variant="dark" size="lg" className="group" onClick={() => window.open('https://tinyurl.com/2kwan9vz', '_blank')}>
            Get in Touch
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Button>
          
          {/* Divider */}
          <div className="border-t border-white/20 pt-8 mt-12">
            <p className="text-white/60 text-sm">
              © 2025 Passet. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;