import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiMail, HiLockClosed } from 'react-icons/hi';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user types
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate name
    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      setError('Please enter your name');
      return;
    }
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      setError('Passwords do not match');
      return;
    }
    
    // Validate password length
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Call backend registration endpoint
      const response = await axios.post('http://localhost:5001/api/users/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      
      console.log('Registration successful:', response.data);
      toast.success('Account created! Check your email to verify your account.');
      setSubmitted(true);
    } catch (err) {
      // Handle errors
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Back to Home Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 transition-colors duration-200 mb-8"
        >
          <HiArrowLeft className="text-xl" />
          <span className="font-medium">Back to Home</span>
        </Link>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Get Started</h1>
            <p className="text-gray-600">Create your PawFect Care account</p>
          </div>

          {submitted ? (
            // Email Verification Message
            <div className="space-y-6">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-center">
                <div className="mb-4">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                    <svg
                      className="h-6 w-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-medium text-blue-900 mb-2">Check Your Email</h3>
                <p className="text-blue-700 text-sm mb-4">
                  We've sent a verification link to <span className="font-semibold">{formData.email}</span>
                </p>
                <p className="text-blue-700 text-sm mb-2">
                  Click the link in the email to verify your account and get started!
                </p>
                <p className="text-blue-600 text-xs">
                  The link will expire in 24 hours. Don't forget to check your spam folder.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Go to Login
                </button>
                <button
                  onClick={() => {
                    setFormData({
                      name: '',
                      email: '',
                      password: '',
                      confirmPassword: '',
                    });
                    setSubmitted(false);
                    setError('');
                  }}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Sign Up with Different Email
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Didn't receive the email?</p>
                <Link
                  to="/signup"
                  className="text-orange-500 hover:text-orange-600 font-medium text-sm"
                >
                  Request a new verification link
                </Link>
              </div>
            </div>
          ) : (
            // Sign Up Form
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
              
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <HiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <HiLockClosed className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    required
                    minLength="6"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <HiLockClosed className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    required
                    minLength="6"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors duration-200 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing Up...' : 'Sign Up'}
              </button>
            </form>
          )}

          {!submitted && (
            // Footer - Only show when not submitted
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-orange-500 hover:text-orange-600 font-medium">
                  Log In
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
