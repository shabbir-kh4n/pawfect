import { Link } from 'react-router-dom';
import { HiArrowLeft, HiMail } from 'react-icons/hi';
import { FaQuestionCircle } from 'react-icons/fa';

const SupportPage = () => {
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
              <FaQuestionCircle className="text-white text-4xl" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-4">
            Support
          </h1>

          {/* Placeholder Text */}
          <div className="text-center text-gray-600 space-y-4">
            <p className="text-lg">
              Welcome to the Support section!
            </p>
            <p>
              This page will contain FAQs, help documentation, contact information, and resources to assist you with any questions or issues you may have while using Pawfect Care.
            </p>
            
            {/* Contact Info */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="flex items-center justify-center gap-2 text-orange-500">
                <HiMail className="text-xl" />
                <span>contact@pawfectcare.com</span>
              </p>
            </div>

            <p className="text-sm text-gray-500 mt-8">
              Content coming soon...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
