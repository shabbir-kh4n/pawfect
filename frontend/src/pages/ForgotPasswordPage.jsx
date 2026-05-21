import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiMail, HiArrowLeft } from 'react-icons/hi';
import toast from 'react-hot-toast';
import axios from 'axios';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [isRegistered, setIsRegistered] = useState(null);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.error('Please enter your email');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                'http://localhost:5001/api/users/forgot-password',
                { email }
            );

            console.log('Reset email sent:', response.data);
            toast.success('Password reset link sent to your email!');
            setIsRegistered(response.data.registered);
            setSubmitted(true);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to send reset email';
            toast.error(errorMessage);
            
            // If user is not registered (404), show that state
            if (error.response?.status === 404) {
                setIsRegistered(false);
                setSubmitted(true);
            }
            
            console.error('Forgot password error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                {/* Header */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
                    <p className="mt-2 text-gray-600">Enter your email to receive a password reset link</p>
                </div>

                {submitted ? (
                    // Success Message or Error Message
                    <div className="space-y-6">
                        {isRegistered ? (
                            // Account Found - Email Sent
                            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 text-center">
                                <div className="mb-4">
                                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                        <svg
                                            className="h-6 w-6 text-green-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <h3 className="text-lg font-medium text-green-900 mb-2">Email Sent!</h3>
                                <p className="text-green-700 text-sm mb-4">
                                    Check your email inbox for a password reset link. The link will expire in 1 hour.
                                </p>
                                <p className="text-green-600 text-xs mb-4">
                                    Email: <span className="font-semibold">{email}</span>
                                </p>
                                <p className="text-green-700 text-sm">
                                    If you don't see the email, check your spam folder.
                                </p>
                            </div>
                        ) : (
                            // Account Not Found
                            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
                                <div className="mb-4">
                                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                        <svg
                                            className="h-6 w-6 text-red-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <h3 className="text-lg font-medium text-red-900 mb-2">Email Not Found</h3>
                                <p className="text-red-700 text-sm mb-4">
                                    No account found with <span className="font-semibold">{email}</span>
                                </p>
                                <p className="text-red-700 text-sm mb-2">
                                    This email is not registered with us. Please:
                                </p>
                                <ul className="text-red-700 text-sm space-y-1 mb-4">
                                    <li>✓ Check if you entered the correct email</li>
                                    <li>✓ Or sign up first if you don't have an account</li>
                                </ul>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={() => navigate('/login')}
                                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                            >
                                Back to Login
                            </button>
                            <button
                                onClick={() => {
                                    setEmail('');
                                    setSubmitted(false);
                                    setIsRegistered(null);
                                }}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
                            >
                                Try Another Email
                            </button>
                        </div>

                        {!isRegistered && (
                            <div className="text-center">
                                <Link
                                    to="/signup"
                                    className="text-orange-500 hover:text-orange-600 font-medium"
                                >
                                    Create an Account
                                </Link>
                            </div>
                        )}
                    </div>
                ) : (
                    // Form
                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <HiMail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={handleInputChange}
                                    required
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'
                                } text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200`}
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>

                        {/* Back to Login */}
                        <div className="text-center">
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-1 text-orange-500 hover:text-orange-600 font-medium text-sm"
                            >
                                <HiArrowLeft className="h-4 w-4" />
                                Back to Login
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
