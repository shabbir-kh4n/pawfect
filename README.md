# 🐾 PawFect Care - Smart Pet Care & Adoption Portal

[![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-Backend-blue)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-Frontend-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Runtime-green)](https://nodejs.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-black)](https://socket.io/)

A comprehensive full-stack MERN application for pet care management and adoption. This project features real-time chat capabilities, AI-powered pet name generation, health record tracking, and a complete adoption workflow system.

**🎓 Academic Project** | Computer Science Engineering - AI Theme | College Mini Project

## 🌐 Live Demo

**Frontend Demo:** [https://p0wfect-care.netlify.app/](https://p0wfect-care.netlify.app/)

> ⚠️ **Note:** The demo only includes the frontend. Backend features (authentication, chat, database operations) are not available in the live demo. To experience full functionality, please follow the installation instructions below.

## ✨ Key Features

### 🏠 Core Features
- **Smart Pet Adoption System**: Browse, filter, and adopt pets with detailed profiles, photo galleries, and AI-powered matching
- **Real-Time Chat System**: Socket.IO powered instant messaging between pet owners and adopters with typing indicators and read receipts
- **Two-Party Adoption Confirmation**: Secure adoption completion workflow requiring confirmation from both owner and adopter
- **Veterinary Services Directory**: Interactive map-based search for veterinary clinics, emergency services, and 24/7 care facilities
- **Health Records Management**: Comprehensive pet health tracking with vaccination records and medical history
- **AI Name Generator**: Google Gemini AI integration for creative and meaningful pet name suggestions
- **Pet Care Guide**: Educational resources with AI-powered Q&A about pet care
- **Adoption Quiz**: Personality-based matching to find compatible pets

### 🔐 Authentication & Security
- JWT-based authentication with secure token management
- Protected routes and API endpoints
- Role-based access control (Pet Owner, Adopter)
- Password encryption using bcrypt
- Email verification with 24-hour token expiry
- Admin account bypass for email verification (demo accounts)
- Secure password reset with email verification

### 🎨 User Experience
- Fully responsive design optimized for mobile, tablet, and desktop
- Modern, intuitive UI built with Tailwind CSS
- Smooth animations and transitions
- Toast notifications for user feedback
- Image upload and preview functionality

## 🛠️ Tech Stack

### Frontend
- React 19.1.1
- Vite 7.1.7
- Tailwind CSS
- Axios 1.12.2
- React Router
- Socket.IO Client (real-time chat)

### Backend
- Node.js
- Express 5.1.0
- MongoDB
- Mongoose 8.19.2
- JWT Authentication
- Socket.IO (real-time chat)
- Multer (file uploads)
- Google Generative AI (Gemini)

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Google Gemini API Key ([Get it free](https://aistudio.google.com/))

## 🚀 Installation

### 1. Clone the repository
```bash
git clone https://github.com/shabbir-kh4n/pawfect.git
cd pawfect
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```bash
cp .env.example .env
```

Update the `.env` file with your credentials:
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/pawfectcare
JWT_SECRET=your_jwt_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
FRONTEND_URL=http://localhost:5173
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. Start the Application

**Backend** (from backend directory):
```bash
node server.js
```

**Frontend** (from frontend directory):
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5174
- Backend: http://localhost:5001

## � User Registration & Admin Accounts

### User Signup
When signing up, users must provide:
- **Full Name**: Display name shown in the application
- **Email**: Used for authentication and notifications
- **Password**: At least 6 characters (bcrypt encrypted)
- **Confirm Password**: Must match the password field

After registration, users receive a verification email with a 24-hour valid link to confirm their email address.

### Admin Accounts
The following admin accounts bypass email verification during login:
- `demo@pawfect.com`
- `shabbir@gmail.com`

These accounts are useful for testing and development purposes. Regular users must verify their email before logging in.

## �📁 Project Structure

```
pawfect/
├── backend/
│   ├── config/         # Database configuration
│   ├── middleware/     # Authentication middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── uploads/        # User uploaded files
│   └── server.js       # Express server
├── frontend/
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── pages/      # Page components
│   │   ├── context/    # React context (Auth)
│   │   └── api/        # API configuration
│   └── public/         # Static assets
└── README.md
```

## 🔑 API Endpoints

### Authentication
- `POST /api/users/register` - Register new user (requires: name, email, password)
- `POST /api/users/login` - User login
- `POST /api/users/verify-email/:token` - Verify email address
- `POST /api/users/forgot-password` - Request password reset
- `POST /api/users/resend-verification-email` - Resend verification email

### Pets
- `GET /api/pets` - Get all pets
- `POST /api/pets` - Create pet record (protected)
- `PUT /api/pets/:id` - Update pet (protected)
- `DELETE /api/pets/:id` - Delete pet (protected)

### Adoption
- `GET /api/adoption` - Get all pets for adoption
- `POST /api/adoption` - List pet for adoption (protected)
- `GET /api/adoption/:id` - Get pet details
- `PUT /api/adoption/:id` - Update adoption listing (protected)
- `DELETE /api/adoption/:id` - Remove adoption listing (protected)

### Veterinary Services
- `GET /api/services` - Get all vet services
- `POST /api/services` - Add vet service (protected)
- `GET /api/services/:id` - Get service details
- `PUT /api/services/:id` - Update service (protected)
- `DELETE /api/services/:id` - Delete service (protected)

### Health Records
- `GET /api/records` - Get all records
- `POST /api/records` - Create health record (protected)

### Chat System
- `GET /api/chats` - Get all chats for current user (protected)
- `GET /api/chats/request/:requestId` - Get or create chat for adoption request (protected)
- `GET /api/chats/:chatId/messages` - Get chat messages (protected)
- `POST /api/chats/:chatId/messages` - Send message in chat (protected)
- `DELETE /api/chats/:chatId` - Delete chat (protected)
- `POST /api/adoption-requests/:requestId/confirm-completion` - Confirm adoption completion (protected)

### AI Name Generator
- `POST /api/ai/generate-name` - Generate pet names with AI

## 💬 Real-Time Chat System

The application features a real-time chat system powered by Socket.IO, enabling direct communication between pet owners and potential adopters. When a user submits an adoption request, a chat room is automatically created. Both parties can communicate in real-time, and adoption completion requires confirmation from both the pet owner and adopter.

For detailed documentation on the chat system, see [CHAT_SYSTEM.md](CHAT_SYSTEM.md).

## 🤖 AI Integration

This project uses Google Gemini AI for:
- Generating creative and meaningful pet names
- Pet care guidance and Q&A
- Personalized adoption recommendations

**Getting Your Free API Key:**
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API key" 
4. Copy your API key (no credit card required)
5. Add to `.env` file: `GEMINI_API_KEY=your_key_here`

**Free Tier Limits:** 15 requests per minute

## 🔒 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Backend server port | `5001` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/pawfectcare` |
| `JWT_SECRET` | Secret key for JWT tokens | `your_secure_random_string` |
| `GEMINI_API_KEY` | Google Gemini API key | `AIza...` |
| `FRONTEND_URL` | Frontend application URL for email links | `http://localhost:5173` |

## 🎯 Learning Outcomes

This project demonstrates proficiency in:
- **Full-Stack Development**: Complete MERN stack implementation
- **Real-Time Communication**: WebSocket integration with Socket.IO
- **RESTful API Design**: Well-structured backend with proper routing
- **State Management**: React Context API for authentication
- **Database Design**: MongoDB schema design and relationships
- **AI Integration**: Google Gemini API implementation
- **Authentication & Authorization**: JWT-based security with email verification
- **Email Verification**: Secure email validation workflow with token expiry
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **File Upload Handling**: Multer for image uploads
- **Error Handling**: Comprehensive error management on frontend and backend
- **Form Validation**: Client and server-side validation for user data

## 🚧 Future Enhancements

- [ ] Push notifications for new messages
- [ ] Advanced search filters with AI recommendations
- [ ] Video call integration for pet viewing
- [ ] Payment gateway for adoption fees
- [ ] Admin dashboard for platform management
- [ ] Mobile application (React Native)
- [ ] Multi-language support
- [ ] Social media integration for sharing pets

## 🤝 Contributing

This is an academic project, but suggestions and feedback are welcome!

## 📧 Contact


- Email: helloshabbirkhanhi@gmail.com
- GitHub: [@shabbir-kh4n](https://github.com/shabbir-kh4n)
- LinkedIn: [Gulam Shabbir Khan](https://www.linkedin.com/in/gulam-shabbir-khan-530528223)

## 📄 License

This project is open source and available for educational purposes.

---

Made with ❤️ for pets and their families 🐶🐱
