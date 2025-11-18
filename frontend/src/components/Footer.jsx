import { Link } from 'react-router-dom';
import { IoPaw } from 'react-icons/io5';
import { HiMail } from 'react-icons/hi';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* PawFect Care Column */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-orange-500 p-2 rounded-lg">
                <IoPaw className="text-white text-xl" />
              </div>
              <span className="text-xl font-bold text-gray-800">PawFect Care</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Smart Pet Care & Adoption Portal - Connecting pets with their purr-fect families through AI-powered matching.
            </p>
          </div>

          {/* Features Column */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-4">Features</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/adoption-quiz" className="text-gray-600 hover:text-orange-500 text-sm transition-colors duration-200">
                  Compatibility Quiz
                </Link>
              </li>
              <li>
                <Link to="/health-tracker" className="text-gray-600 hover:text-orange-500 text-sm transition-colors duration-200">
                  Health Tracker
                </Link>
              </li>
              <li>
                <Link to="/pet-services" className="text-gray-600 hover:text-orange-500 text-sm transition-colors duration-200">
                  Location Services
                </Link>
              </li>
              <li>
                <Link to="/name-generator" className="text-gray-600 hover:text-orange-500 text-sm transition-colors duration-200">
                  Name Generator
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/pet-care-guide" className="text-gray-600 hover:text-orange-500 text-sm transition-colors duration-200">
                  Pet Care Guide
                </Link>
              </li>
              <li>
                <Link to="/adoption-process" className="text-gray-600 hover:text-orange-500 text-sm transition-colors duration-200">
                  Adoption Process
                </Link>
              </li>
              <li>
                <Link to="/health-resources" className="text-gray-600 hover:text-orange-500 text-sm transition-colors duration-200">
                  Health Resources
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-600 hover:text-orange-500 text-sm transition-colors duration-200">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect Column */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4 mb-4">
              <a
                href="mailto:contact@pawfectcare.com"
                className="text-gray-600 hover:text-orange-500 transition-colors duration-200"
                aria-label="Email"
              >
                <HiMail className="text-2xl" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-orange-500 transition-colors duration-200"
                aria-label="GitHub"
              >
                <FaGithub className="text-2xl" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-orange-500 transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="text-2xl" />
              </a>
            </div>
            <p className="text-gray-600 text-sm">
              CSE AI Themed | College Mini Project
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-600 text-sm">
            © 2025 PawFect Care. Built with <span className="text-red-500">❤️</span> by pets and their families.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
