const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const { sendPasswordResetEmail, sendVerificationEmail } = require('../utils/emailService');

const router = express.Router();

// Admin emails that bypass email verification on login
const ADMIN_EMAILS = ['demo@pawfect.com', 'shabbir@gmail.com'];

// Rate limiters for different endpoints
// Prevent brute force login attacks: 5 attempts per 15 minutes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 5,                     // 5 attempts
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,      // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,       // Disable `X-RateLimit-*` headers
  skip: (req) => req.ip === '::1' || req.ip === '127.0.0.1', // Skip localhost (development)
});

// Prevent brute force on forgot-password: 3 attempts per 15 minutes
const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: 'Too many password reset attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Prevent spam registration: 5 attempts per hour
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 hour
  max: 5,
  message: 'Too many accounts created from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Prevent token verification spam: 10 attempts per 15 minutes
const verifyTokenLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many verification attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// @route   POST /api/users/register
// @desc    Register a new user and send verification email
// @access  Public
router.post('/register', registerLimiter, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email and password' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists && userExists.isEmailVerified) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // If unverified user exists, delete them to allow re-registration
    if (userExists && !userExists.isEmailVerified) {
      await User.deleteOne({ email });
    }

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const hashedVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');

    // Create new user (password will be hashed by the pre-save hook in User model)
    const user = await User.create({
      name,
      email,
      password,
      emailVerificationToken: hashedVerificationToken,
      emailVerificationExpiry: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    // Send verification email
    try {
      await sendVerificationEmail(user.email, verificationToken);
      
      res.status(201).json({
        message: 'Registration successful! Please check your email to verify your account.',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isEmailVerified: user.isEmailVerified,
        },
      });
    } catch (emailError) {
      // Delete user if email sending fails
      await User.deleteOne({ _id: user._id });
      
      console.error('Email error:', emailError);
      res.status(500).json({ 
        message: 'Error sending verification email. Please try registering again.' 
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route   POST /api/users/login
// @desc    Login user
// @access  Public
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check if email is verified (skip for admin emails)
    if (!user.isEmailVerified && !ADMIN_EMAILS.includes(email)) {
      return res.status(403).json({ 
        message: 'Please verify your email before logging in. Check your email inbox for the verification link.',
        emailVerified: false
      });
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Send response
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   POST /api/users/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password', forgotPasswordLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({ message: 'Please provide email' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      // User not registered - return 404 to indicate account doesn't exist
      return res.status(404).json({ 
        message: 'No account found with this email address. Please check the email or sign up first.',
        registered: false
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Save hashed token and expiry to user (expires in 1 hour)
    user.resetToken = hashedToken;
    user.resetTokenExpiry = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    // Send email with reset link
    try {
      await sendPasswordResetEmail(user.email, resetToken);
      res.status(200).json({ 
        message: 'Password reset link has been sent to your email',
        registered: true
      });
    } catch (emailError) {
      // Clear the reset token if email fails
      user.resetToken = null;
      user.resetTokenExpiry = null;
      await user.save();
      
      console.error('Email error:', emailError);
      res.status(500).json({ 
        message: 'Error sending password reset email. Please try again later.' 
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error during password reset request' });
  }
});

// @route   POST /api/users/reset-password/:token
// @desc    Reset password with token
// @access  Public
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    // Validate inputs
    if (!password || !confirmPassword) {
      return res.status(400).json({ message: 'Please provide password and confirm password' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Hash the token to find the user
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid reset token
    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: Date.now() }, // Token must not be expired
    });

    if (!user) {
      return res.status(400).json({ 
        message: 'Password reset token is invalid or has expired' 
      });
    }

    // Update password and clear reset token
    user.password = password; // Will be hashed by pre-save hook
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.status(200).json({ 
      message: 'Password has been reset successfully. You can now log in with your new password.' 
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error during password reset' });
  }
});

// @route   GET /api/users/verify-reset-token/:token
// @desc    Verify if reset token is valid
// @access  Public
router.get('/verify-reset-token/:token', async (req, res) => {
  try {
    const { token } = req.params;

    // Hash the token to find the user
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid reset token
    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ 
        message: 'Password reset token is invalid or has expired',
        valid: false
      });
    }

    res.status(200).json({ 
      message: 'Token is valid',
      valid: true
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ message: 'Server error during token verification' });
  }
});

// @route   POST /api/users/verify-email/:token
// @desc    Verify email with token
// @access  Public
router.post('/verify-email/:token', verifyTokenLimiter, async (req, res) => {
  try {
    const { token } = req.params;

    // Hash the token to find the user
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid verification token
    let user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpiry: { $gt: Date.now() }, // Token must not be expired
    });

    // If user not found with token, check if they're already verified
    if (!user) {
      // Try to find user by checking if this token matches a user who's already verified
      user = await User.findOne({
        emailVerificationToken: hashedToken,
      });

      if (user && user.isEmailVerified) {
        // Email is already verified - return success
        const jwtToken = jwt.sign(
          { id: user._id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: '30d' }
        );

        return res.status(200).json({ 
          message: 'Email already verified! You can now log in.',
          verified: true,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
          },
          token: jwtToken,
        });
      }

      return res.status(400).json({ 
        message: 'Email verification token is invalid or has expired',
        verified: false
      });
    }

    // Mark email as verified and clear verification token
    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpiry = null;
    await user.save();

    // Generate JWT token for auto-login after verification
    const jwtToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(200).json({ 
      message: 'Email verified successfully! You can now log in.',
      verified: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token: jwtToken,
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Server error during email verification' });
  }
});

// @route   POST /api/users/resend-verification-email
// @desc    Resend verification email
// @access  Public
router.post('/resend-verification-email', verifyTokenLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({ message: 'Please provide email' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        message: 'No account found with this email address'
      });
    }

    // Check if email is already verified
    if (user.isEmailVerified) {
      return res.status(400).json({ 
        message: 'This email is already verified'
      });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const hashedVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');

    // Update user with new token
    user.emailVerificationToken = hashedVerificationToken;
    user.emailVerificationExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save();

    // Send verification email
    try {
      await sendVerificationEmail(user.email, verificationToken);
      res.status(200).json({ 
        message: 'Verification email has been resent. Please check your inbox.' 
      });
    } catch (emailError) {
      console.error('Email error:', emailError);
      res.status(500).json({ 
        message: 'Error sending verification email. Please try again later.' 
      });
    }
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ message: 'Server error during email resend' });
  }
});

module.exports = router;
