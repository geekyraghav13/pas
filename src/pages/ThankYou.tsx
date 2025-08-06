import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
const ThankYou = () => {
  const navigate = useNavigate();
  return <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center text-white">
        <div className="mb-8">
          <CheckCircle className="w-24 h-24 mx-auto text-white mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Thank You!
          </h1>
          <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8">Your meeting request has been submitted successfully. We'll get back to you within 24 hours to discuss.</p>
          <p className="text-lg text-white/80 mb-8">
            In the meantime, feel free to explore our resources or reach out if you have any questions.
          </p>
        </div>
        
        <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
          <Button variant="cta" size="lg" onClick={() => navigate('/')} className="w-full md:w-auto h-14 text-lg font-semibold">
            Back to Home
          </Button>
          <Button variant="outline" size="lg" onClick={() => window.open('https://tinyurl.com/2kwan9vz', '_blank')} className="w-full md:w-auto h-14 text-lg font-semibold bg-white/10 text-white border-white/30 hover:bg-white/20">Schedule a Meet</Button>
        </div>
      </div>
    </div>;
};
export default ThankYou;