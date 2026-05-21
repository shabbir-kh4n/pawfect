# Password Reset Feature Implementation

## Overview
A complete password reset feature has been added to the Pawfect Care application. This allows users who forget their password to securely reset it via email.

## Features Implemented

### Backend Changes

1. **User Model Update** (`backend/models/User.js`)
   - Added `resetToken` field to store the password reset token
   - Added `resetTokenExpiry` field to store when the token expires (1 hour)

2. **Email Service** (`backend/utils/emailService.js`)
   - Created email utility for sending password reset emails
   - Uses Nodemailer with Gmail SMTP
   - Beautiful HTML email template with reset link

3. **New API Routes** (`backend/routes/userRoutes.js`)
   - **POST** `/api/users/forgot-password` - Request password reset email
   - **POST** `/api/users/reset-password/:token` - Reset password with token
   - **GET** `/api/users/verify-reset-token/:token` - Verify if token is valid

4. **Environment Variables** (`.env`)
   ```
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_specific_password
   FRONTEND_URL=http://localhost:5173
   ```

### Frontend Changes

1. **ForgotPasswordPage** (`frontend/src/pages/ForgotPasswordPage.jsx`)
   - Page for users to request password reset
   - Shows success message after email is sent
   - Option to try another email or return to login

2. **ResetPasswordPage** (`frontend/src/pages/ResetPasswordPage.jsx`)
   - Page for resetting password with the token from email
   - Validates token on page load
   - Shows error if token is invalid or expired
   - Requires password confirmation
   - Password visibility toggle

3. **Updated LoginPage** (`frontend/src/pages/LoginPage.jsx`)
   - Added "Forgot Password?" link below password field
   - Links to ForgotPasswordPage

4. **Updated App.jsx**
   - Added routes for new pages:
     - `/forgot-password` → ForgotPasswordPage
     - `/reset-password/:token` → ResetPasswordPage

## Setup Instructions

### 1. Gmail Configuration

To enable password reset emails, you need to set up Gmail credentials:

1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Enable 2-Factor Authentication
3. Create an [App Password](https://support.google.com/accounts/answer/185833)
4. Update `.env` file with your credentials:
   ```
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_specific_password
   ```

### 2. Install Dependencies

The backend now requires `nodemailer`:

```bash
cd backend
npm install
```

### 3. Start the Application

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

## How It Works

### User Flow

1. **Forgot Password Request**
   - User clicks "Forgot Password?" on login page
   - Enters email address
   - Receives email with reset link (expires in 1 hour)

2. **Reset Password**
   - User clicks link in email
   - Verifies token is valid
   - Enters new password and confirmation
   - Password is updated and token is cleared

3. **Security Features**
   - Tokens are hashed before storing in database
   - Tokens expire after 1 hour
   - Password is hashed with bcrypt before saving
   - No password is sent in emails (only reset link)

## API Response Examples

### Forgot Password
```javascript
// Request
POST /api/users/forgot-password
{
  "email": "user@example.com"
}

// Response
{
  "message": "If an account exists with this email, a password reset link has been sent."
}
```

### Reset Password
```javascript
// Request
POST /api/users/reset-password/[token]
{
  "password": "newpassword123",
  "confirmPassword": "newpassword123"
}

// Response
{
  "message": "Password has been reset successfully. You can now log in with your new password."
}
```

### Verify Token
```javascript
// Request
GET /api/users/verify-reset-token/[token]

// Response
{
  "message": "Token is valid",
  "valid": true
}
```

## Error Handling

The feature includes comprehensive error handling:

- **Invalid Email Format**: Validated by schema
- **Non-existent User**: Returns generic message (security best practice)
- **Invalid Token**: Shows error message
- **Expired Token**: Shows link to request new reset
- **Password Mismatch**: Shows validation error
- **Email Sending Failure**: Returns server error

## Testing

### Test Scenario 1: Valid Reset
1. Go to `/login` → Click "Forgot Password?"
2. Enter registered email
3. Check email for reset link
4. Click link and reset password
5. Try logging in with new password

### Test Scenario 2: Invalid Token
1. Manually construct invalid reset link
2. Should show "Link Expired" message

### Test Scenario 3: Expired Token
1. Wait over 1 hour after requesting reset
2. Token should be invalid

## Environment Variables Summary

| Variable | Description | Example |
|----------|-------------|---------|
| `EMAIL_SERVICE` | Email service provider | `gmail` |
| `EMAIL_USER` | Sender email address | `myapp@gmail.com` |
| `EMAIL_PASSWORD` | App-specific password | `xxxx xxxx xxxx xxxx` |
| `FRONTEND_URL` | Frontend URL for reset links | `http://localhost:5173` |

## Security Considerations

✅ **Implemented:**
- Passwords hashed with bcrypt
- Reset tokens hashed before storage
- Tokens expire after 1 hour
- Generic error messages (don't reveal if email exists)
- HTTPS recommended for production

📋 **For Production:**
- Use environment variables for all secrets
- Set `FRONTEND_URL` to your production domain
- Use HTTPS everywhere
- Consider rate limiting on forgot-password endpoint
- Monitor failed reset attempts

## Troubleshooting

### Emails not being sent?
- Check EMAIL_USER and EMAIL_PASSWORD in .env
- Verify Gmail 2FA is enabled
- Verify App Password is being used (not Gmail password)
- Check email service firewall settings

### Token verification fails?
- Ensure frontend and backend FRONTEND_URL match
- Check that MongoDB connection is working
- Verify resetToken and resetTokenExpiry fields exist in database

### Password not being updated?
- Check bcrypt pre-save hook in User model
- Verify MongoDB save operation completed
- Check for validation errors

## File Summary

### New Files Created
- `backend/utils/emailService.js` - Email sending utility
- `frontend/src/pages/ForgotPasswordPage.jsx` - Forgot password UI
- `frontend/src/pages/ResetPasswordPage.jsx` - Reset password UI

### Modified Files
- `backend/models/User.js` - Added reset token fields
- `backend/routes/userRoutes.js` - Added password reset endpoints
- `backend/package.json` - Added nodemailer dependency
- `backend/.env` - Added email configuration
- `backend/.env.example` - Updated with email config
- `frontend/src/pages/LoginPage.jsx` - Added "Forgot Password?" link
- `frontend/src/App.jsx` - Added new routes

## Next Steps

1. Update `.env` with your Gmail credentials
2. Run `npm install` in backend
3. Test the password reset flow
4. For production, update FRONTEND_URL and email configuration
5. Consider adding rate limiting and additional security measures
