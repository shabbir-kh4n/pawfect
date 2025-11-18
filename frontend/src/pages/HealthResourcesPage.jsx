import { Link } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';
import { MdShield } from 'react-icons/md';

const HealthResourcesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 transition-colors duration-200 mb-8"
        >
          <HiArrowLeft className="text-xl" />
          <span className="font-medium">Back to Home</span>
        </Link>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-orange-500 p-4 rounded-full">
              <MdShield className="text-white text-4xl" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-4">
            Health Resources
          </h1>

          {/* Placeholder Text */}
          <div className="text-center text-gray-600 space-y-4">
            <p className="text-lg">
              Welcome to the Health Resources section!
            </p>
            <p>
              This page will provide essential health information for your pets, including vaccination schedules, common health issues, preventive care tips, and emergency resources.
            </p>
            <p className="text-sm text-gray-500 mt-8">
              Content coming soon...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthResourcesPage;
