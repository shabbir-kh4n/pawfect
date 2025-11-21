# 🐾 Pawfect Care

A comprehensive MERN stack web application for pet care management, featuring pet adoption, veterinary services directory, health records tracking, and AI-powered pet name generation.

## ✨ Features

- **Pet Adoption System**: Browse, search, and adopt pets with detailed profiles and photo galleries
- **Veterinary Services Directory**: Find veterinary clinics, emergency services, and 24/7 care facilities
- **Health Records Management**: Track and manage pet health records
- **AI Name Generator**: Generate creative pet names using Google Gemini AI
- **User Authentication**: Secure JWT-based authentication system
- **Responsive Design**: Modern UI built with React and Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- React 19.1.1
- Vite 7.1.7
- Tailwind CSS
- Axios 1.12.2
- React Router

### Backend
- Node.js
- Express 5.1.0
- MongoDB
- Mongoose 8.19.2
- JWT Authentication
- Multer (file uploads)
- Google Generative AI (Gemini)

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Google Gemini API Key ([Get it free](https://aistudio.google.com/))

## 🚀 Installation

### 1. Clone the repository
```bash
git clone https://github.com/shabbir-/pawfect.git
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

## 📁 Project Structure

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
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login

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

### AI Name Generator
- `POST /api/ai/generate-name` - Generate pet names with AI

## 🤖 AI Integration

This project uses Google Gemini AI for generating creative pet names. To get your free API key:

1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Click "Get API key"
3. No credit card required
4. Free tier includes 15 requests per minute

## 🔒 Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Backend server port |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `GEMINI_API_KEY` | Google Gemini API key |

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🐛 Issues

If you find any bugs or have feature requests, please create an issue on GitHub.

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

Made with ❤️ for pet lovers everywhere 🐶🐱
