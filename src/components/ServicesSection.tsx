const ServicesSection = () => {
  return <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* What We Offer Badge */}
        <div className="flex items-center justify-center gap-3 mb-16">
          <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-white rounded-full"></div>
          </div>
          <span className="text-primary font-semibold text-lg">What We Offer</span>
        </div>
        
        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Actionable Playbooks */}
          <div className="bg-dark-bg rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-dark-bg to-dark-card"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-6">
                Actionable Playbooks for Growth
              </h3>
              <p className="text-white/80 leading-relaxed">
                Product Development, Monetization Due Diligence and Ongoing Strategic Support.
              </p>
            </div>
          </div>
          
          {/* Capital */}
          <div className="bg-gray-100 rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Capital
              </h3>
              <p className="text-lg font-semibold text-gray-700 mb-4">
                Up to 50% of the capital requirement.
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                
                
              </div>
            </div>
          </div>
          
          {/* Exits */}
          <div className="bg-dark-bg rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-dark-bg to-dark-card"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-6">
                Exits
              </h3>
              <p className="text-white/80 leading-relaxed">
                Access our extensive network of buyers & brokers to help you get the right valuation if & when you want to sell!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default ServicesSection;