import { Link } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi';
import { FaBrain, FaUsers, FaLightbulb } from 'react-icons/fa';
import { IoMdHeart } from 'react-icons/io';
import { MdLocationOn, MdShield } from 'react-icons/md';

const HomePage = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-orange-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Find Your <span className="text-orange-500">PawFect</span>
              <br />
              Companion
            </h1>
            
            {/* Subtitle */}
            <p className="text-gray-600 text-lg md:text-xl mb-8 max-w-3xl mx-auto">
              AI-powered pet matching, comprehensive health tracking, and location-based services all in one
              smart platform. Making pet adoption and care easier than ever.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link
                to="/adopt"
                className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors duration-200 font-medium flex items-center gap-2"
              >
                Start Your Journey
                <HiArrowRight className="text-xl" />
              </Link>
              <Link
                to="/adoption-quiz"
                className="bg-white text-gray-700 px-8 py-3 rounded-lg border-2 border-gray-300 hover:border-orange-500 hover:text-orange-500 transition-colors duration-200 font-medium"
              >
                Take Compatibility Quiz
              </Link>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div>
                <h3 className="text-4xl font-bold text-orange-500">10,000+</h3>
                <p className="text-gray-600 mt-2">Happy Adoptions</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold text-orange-500">95%</h3>
                <p className="text-gray-600 mt-2">Match Success Rate</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold text-orange-500">24/7</h3>
                <p className="text-gray-600 mt-2">Health Monitoring</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Everything You Need for Pet Care */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Pet Care
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Comprehensive features designed to make pet adoption and care seamless,
              backed by AI technology and community insights.
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1: AI-Powered Compatibility Quiz */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <FaBrain className="text-blue-500 text-3xl" />
                <span className="bg-orange-100 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full">
                  AI-Powered
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                AI-Powered Compatibility Quiz
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Smart matching algorithm that evaluates lifestyle, living situation, and preferences to find your perfect pet companion.
              </p>
            </div>

            {/* Card 2: Health Tracking & Reminders */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <IoMdHeart className="text-red-500 text-3xl" />
                <span className="bg-red-100 text-red-600 text-xs font-semibold px-3 py-1 rounded-full">
                  Health First
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Health Tracking & Reminders
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Digital health cards with vaccination schedules, deworming reminders, and automated next-due notifications.
              </p>
            </div>

            {/* Card 3: Location-Based Services */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <MdLocationOn className="text-green-500 text-3xl" />
                <span className="bg-green-100 text-green-600 text-xs font-semibold px-3 py-1 rounded-full">
                  Location Smart
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Location-Based Services
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Find nearby veterinarians, emergency clinics, pet-friendly places, and shelters with real-time availability.
              </p>
            </div>

            {/* Card 4: Pet-Friendly Directory */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <FaUsers className="text-purple-500 text-3xl" />
                <span className="bg-yellow-100 text-yellow-600 text-xs font-semibold px-3 py-1 rounded-full">
                  Community Driven
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Pet-Friendly Directory
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Crowdsourced database of pet-friendly restaurants, parks, hotels, and services in your area.
              </p>
            </div>

            {/* Card 5: AI Pet Name Generator */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <FaLightbulb className="text-yellow-500 text-3xl" />
                <span className="bg-yellow-100 text-yellow-600 text-xs font-semibold px-3 py-1 rounded-full">
                  Fun Feature
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                AI Pet Name Generator
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Creative AI-powered name suggestions based on your pet's personality, breed, and characteristics.
              </p>
            </div>

            {/* Card 6: Adoption Success Tracking */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <MdShield className="text-blue-500 text-3xl" />
                <span className="bg-purple-100 text-purple-600 text-xs font-semibold px-3 py-1 rounded-full">
                  Post-Adoption Support
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Adoption Success Tracking
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Monitor adoption outcomes and provide post-adoption support to ensure long-term pet-owner happiness.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
