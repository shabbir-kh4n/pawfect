import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { HiLockClosed, HiCheckCircle, HiExclamationCircle } from 'react-icons/hi';
import toast from 'react-hot-toast';
import axios from 'axios';

const ResetPasswordPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(true);
    const [tokenValid, setTokenValid] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);

    // Verify token on component mount
    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5001/api/users/verify-reset-token/${token}`
                );
                setTokenValid(response.data.valid);
            } catch (error) {
                console.error('Token verification failed:', error);
                setTokenValid(false);
                toast.error('Invalid or expired password reset link');
            } finally {
                setVerifying(false);
            }
        };

        verifyToken();
    }, [token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validateForm = () => {
        if (!formData.password || !formData.confirmPassword) {
            toast.error('Please fill in all fields');
            return false;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                `http://localhost:5001/api/users/reset-password/${token}`,
                {
                    password: formData.password,
                    confirmPassword: formData.confirmPassword,
                }
            );

            console.log('Password reset successful:', response.data);
            toast.success('Password reset successfully!');
            setResetSuccess(true);

            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to reset password';
            toast.error(errorMessage);
            console.error('Reset password error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Verifying token
    if (verifying) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center py-12 px-4">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                    <p className="mt-4 text-gray-600">Verifying reset link...</p>
                </div>
            </div>
        );
    }

    // Invalid token
    if (!tokenValid) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                    <div className="text-center">
                        <HiExclamationCircle className="mx-auto h-12 w-12 text-red-500" />
                        <h2 className="mt-4 text-2xl font-bold text-gray-900">Link Expired</h2>
                        <p className="mt-2 text-gray-600">
                            The password reset link is invalid or has expired.
                        </p>
                        <p className="mt-2 text-sm text-gray-500">
                            Password reset links expire after 1 hour for security reasons.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <Link
                            to="/forgot-password"
                            className="block w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                        >
                            Request New Reset Link
                        </Link>
                        <Link
                            to="/login"
                            className="block w-full text-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
                        >
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Success message
    if (resetSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                    <div className="text-center">
                        <HiCheckCircle className="mx-auto h-12 w-12 text-green-500" />
                        <h2 className="mt-4 text-2xl font-bold text-gray-900">Password Reset</h2>
                        <p className="mt-2 text-gray-600">
                            Your password has been successfully reset!
                        </p>
                        <p className="mt-2 text-sm text-gray-500">
                            Redirecting to login page...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Reset form
    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                {/* Header */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">Create New Password</h2>
                    <p className="mt-2 text-gray-600">Enter your new password below</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <HiLockClosed className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                                placeholder="Enter new password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? '⛔' : '👁️'}
                            </button>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Must be at least 6 characters</p>
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Confirm Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <HiLockClosed className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required
                                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                                placeholder="Confirm new password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                            >
                                {showConfirmPassword ? '⛔' : '👁️'}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'
                            } text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200`}
                    >
                        {loading ? 'Resetting Password...' : 'Reset Password'}
                    </button>

                    {/* Back to Login */}
                    <div className="text-center">
                        <Link to="/login" className="text-orange-500 hover:text-orange-600 font-medium text-sm">
                            Back to Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
