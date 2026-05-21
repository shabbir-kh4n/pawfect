const nodemailer = require('nodemailer');

// Create transporter using Gmail or email service
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken) => {
    try {
        // Create reset URL - adjust domain based on deployment
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request - Pawfect Care',
            html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #ff6b35; text-align: center;">Password Reset Request</h2>
            
            <p>Hello,</p>
            
            <p>We received a request to reset your password for your Pawfect Care account. If you didn't make this request, please ignore this email.</p>
            
            <p>Click the button below to reset your password. This link will expire in 1 hour.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="display: inline-block; background-color: #ff6b35; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Reset Password
              </a>
            </div>
            
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 3px;">
              ${resetUrl}
            </p>
            
            <p style="color: #666; font-size: 12px; margin-top: 30px;">
              This password reset link will expire in 1 hour. If you continue to have problems accessing your account, please contact our support team.
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            
            <p style="color: #666; font-size: 12px; text-align: center;">
              © 2026 Pawfect Care. All rights reserved.
            </p>
          </div>
        </div>
      `,
        };

        await transporter.sendMail(mailOptions);
        return { success: true, message: 'Password reset email sent successfully' };
    } catch (error) {
        console.error('Email sending error:', error);
        throw new Error('Failed to send password reset email');
    }
};

// Send email verification email
const sendVerificationEmail = async (email, verificationToken) => {
    try {
        // Create verification URL - adjust domain based on your deployment
        const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email/${verificationToken}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verify Your Email - Pawfect Care',
            html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #ff6b35; text-align: center;">Welcome to Pawfect Care! 🐾</h2>
            
            <p>Hello,</p>
            
            <p>Thank you for signing up with Pawfect Care! To complete your registration and start using your account, please verify your email address.</p>
            
            <p>Click the button below to verify your email. This link will expire in 24 hours.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" style="display: inline-block; background-color: #ff6b35; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Verify Email
              </a>
            </div>
            
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 3px;">
              ${verificationUrl}
            </p>
            
            <p style="color: #666; font-size: 12px; margin-top: 30px;">
              If you didn't create this account, please ignore this email or contact our support team.
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            
            <p style="color: #666; font-size: 12px; text-align: center;">
              © 2026 Pawfect Care. All rights reserved.
            </p>
          </div>
        </div>
      `,
        };

        await transporter.sendMail(mailOptions);
        return { success: true, message: 'Verification email sent successfully' };
    } catch (error) {
        console.error('Email sending error:', error);
        throw new Error('Failed to send verification email');
    }
};

module.exports = { sendPasswordResetEmail, sendVerificationEmail };
