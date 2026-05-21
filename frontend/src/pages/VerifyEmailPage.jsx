import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { HiCheckCircle, HiExclamationCircle } from 'react-icons/hi';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const VerifyEmailPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');
  const verificationAttempted = useRef(false);

  // Verify email on component mount
  useEffect(() => {
    // Prevent multiple verification attempts
    if (verificationAttempted.current) return;
    verificationAttempted.current = true;

    const verifyEmail = async () => {
      try {
        const response = await axios.post(
          `http://localhost:5001/api/users/verify-email/${token}`
        );
        
        console.log('Email verified response:', response.data);
        
        // Check if verification was successful on backend
        if (response.data.verified || response.status === 200) {
          toast.success('Email verified successfully!');
          
          // Auto-login the user if we have token and user data
          try {
            if (response.data.token && response.data.user) {
              login({
                token: response.data.token,
                user: response.data.user,
              });
            }
          } catch (loginError) {
            console.error('Login error (but verification succeeded):', loginError);
            // Even if login fails, verification was successful, so show success screen
          }
          
          setVerified(true);
          setError('');
        }
      } catch (err) {
        console.error('Email verification failed:', err);
        console.log('Error response:', err.response);
        const errorMessage = err.response?.data?.message || 'Email verification failed';
        setError(errorMessage);
        toast.error(errorMessage);
        setVerified(false);
      } finally {
        setVerifying(false);
      }
    };

    verifyEmail();
  }, [token, login]);

  // Handle redirect after successful verification
  useEffect(() => {
    if (verified) {
      const redirectTimer = setTimeout(() => {
        navigate('/');
      }, 2000);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [verified, navigate]);

  // Verifying email
  if (verifying) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-600">Verifying your email...</p>
        </div>
      </div>
    );
  }

  // Email verified successfully
  if (verified) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
          <div className="text-center">
            <HiCheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Email Verified!</h2>
            <p className="mt-2 text-gray-600">
              Your email has been successfully verified. Welcome to Pawfect Care! 🐾
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Redirecting to home page...
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/')}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Verification failed
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <HiExclamationCircle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Verification Failed</h2>
          <p className="mt-2 text-gray-600">
            {error || 'The verification link is invalid or has expired.'}
          </p>
        </div>

        <div className="space-y-3">
          <Link
            to="/signup"
            className="block w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Back to Sign Up
          </Link>
          <Link
            to="/login"
            className="block w-full text-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Go to Login
          </Link>
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
    </div>
  );
};

export default VerifyEmailPage;
