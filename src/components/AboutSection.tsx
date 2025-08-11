import { Button } from "@/components/ui/button";

const AboutSection = () => {
  return (
    <section className="py-20 bg-section-bg">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* About Us Badge */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center p-1">
              <img
                src="/logo.svg"
                alt="Company Logo"
                className="w-full h-full rounded-full"
              />
            </div>
            <span className="text-primary font-semibold text-lg">About Us</span>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Acquiring a business is hard; we know - we've done it.
            </h2>

            <p className="text-xl text-gray-600 leading-relaxed">
              If you've identified an internet business that you want to
              takeover - we're here to help with the capital & know how
            </p>

            <Button
              variant="outline"
              size="lg"
              className="group border-primary text-primary hover:bg-primary hover:text-white"
              onClick={() => window.open("https://tinyurl.com/2kwan9vz", "_blank")}
            >
              Get in Touch
              <svg
                className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;