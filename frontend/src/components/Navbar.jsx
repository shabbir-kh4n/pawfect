import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';
import { IoPaw } from 'react-icons/io5';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const navLinks = [
    { name: 'Adopt', path: '/adopt' },
    { name: 'Donate Pet', path: '/donate-pet' },
    { name: 'My Chats', path: '/chats', requiresAuth: true },
    { name: 'Adoption Quiz', path: '/adoption-quiz' },
    { name: 'Health Tracker', path: '/health-tracker' },
    { name: 'Pet Services', path: '/pet-services' },
    { name: 'Name Generator', path: '/name-generator' },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-[1000]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-orange-500 p-2 rounded-lg">
              <IoPaw className="text-white text-xl" />
            </div>
            <span className="text-xl font-bold text-gray-800">PawFect Care</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => {
              // Skip auth-required links if not logged in
              if (link.requiresAuth && !user) return null;
              
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-gray-600 hover:text-orange-500 transition-colors duration-200 text-sm font-medium"
                >
                  {link.name}
                </Link>
              );
            })}
            
            {user ? (
              // Logged in: Show user info and logout
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 text-sm font-medium">
                  Hi, {user.name || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              // Not logged in: Show login and signup
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-orange-500 transition-colors duration-200 text-sm font-medium"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-200 text-sm font-medium"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-orange-500 focus:outline-none"
            >
              {isOpen ? <HiX className="text-2xl" /> : <HiMenu className="text-2xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden pb-4">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => {
                // Skip auth-required links if not logged in
                if (link.requiresAuth && !user) return null;
                
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="text-gray-600 hover:text-orange-500 transition-colors duration-200 text-sm font-medium py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                );
              })}
              
              {user ? (
                // Logged in: Show user info and logout
                <>
                  <div className="text-gray-700 text-sm font-medium py-2 border-t border-gray-200 mt-2 pt-3">
                    Hi, {user.name || user.email}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm font-medium text-center"
                  >
                    Logout
                  </button>
                </>
              ) : (
                // Not logged in: Show login and signup
                <>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-orange-500 transition-colors duration-200 text-sm font-medium py-2 border-t border-gray-200 mt-2 pt-3"
                    onClick={() => setIsOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-200 text-sm font-medium text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
