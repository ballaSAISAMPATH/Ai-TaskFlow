# AI Task Flow - Intelligent Task Management System

An AI-powered task management web application that breaks down your goals into actionable weekly and daily tasks using artificial intelligence. Set a goal with a timeline, and let AI create a structured roadmap to help you achieve it.

## 🚀 Features

- **AI-Powered Task Generation**: Input your goal and timeline, get intelligent weekly and daily task breakdowns
- **Flexible Timeline Planning**: Support for weekly and daily task scheduling
- **Manual Task Management**: Add, edit, and manage tasks manually alongside AI-generated ones
- **User Authentication**: Secure JWT-based authentication with Firebase integration
- **Responsive Design**: Modern UI built with React, Tailwind CSS, and Shadcn components
- **Real-time Updates**: Redux Toolkit for efficient state management

## 🏗️ Architecture

### Frontend
- **React** - Modern UI library
- **Redux Toolkit** - State management
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - High-quality UI components

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **MVC Architecture** - Clean code organization
- **JWT Authentication** - Secure user authentication

### AI Microservice
- **Python FastAPI** - High-performance API framework
- **LangChain** - AI prompt templates and orchestration
- **Gemini AI API** - Google's advanced AI model

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v14 or higher)
- Python (3.8 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager
- pip (Python package manager)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Prasadraogorle/Ai-TaskFlow.git
cd Ai-TaskFlow
```

### 2. Frontend Setup

```bash
cd front-end
npm install
```

Create a `.env` file in the `front-end` directory:

```env
VITE_apiKey=your_firebase_api_key
VITE_authDomain=your_firebase_auth_domain
VITE_projectId=your_firebase_project_id
VITE_storageBucket=your_firebase_storage_bucket
VITE_messagingSenderId=your_firebase_messaging_sender_id
VITE_appId=your_firebase_app_id
VITE_measurementId=your_firebase_measurement_id
VITE_BACKEND_URL=http://localhost:5000
```

### 3. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY_ID=your_firebase_private_key_id
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_CLIENT_ID=your_firebase_client_id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_CERT_URL=your_firebase_client_cert_url
FIREBASE_UNIVERSE_DOMAIN=googleapis.com
JWT_SECRET_KEY=your_jwt_secret_key
GEMINI_API=your_gemini_api_key
CLIENT_ORIGIN=http://localhost:3000
MICROSERVICE_URL=http://localhost:8000
```

### 4. AI Microservice Setup

```bash
cd GeminiAiMicroservice
pip install -r requirements.txt
```

## 🚀 Running the Application

### Development Mode

1. **Start the AI Microservice** (Terminal 1):
```bash
cd GeminiAiMicroservice
python run_server.py
```

2. **Start the Backend Server** (Terminal 2):
```bash
cd server
npm run dev
```

3. **Start the Frontend** (Terminal 3):
```bash
cd front-end
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`
- AI Microservice: `http://localhost:8000`

## 🔧 Development Tools

- **VSCode** - Primary development environment
- **Postman** - API testing and development
- **LM Studio** - Local language model testing

## 🌐 Deployment

The application is deployed on **Render**. Make sure to configure the following for production:

1. Set all environment variables in your Render dashboard
2. Configure build commands for each service
3. Set up proper CORS origins for production URLs
4. Ensure MongoDB connection string is configured for production

### Build Commands for Render:

**Frontend:**
```bash
cd front-end && npm install && npm run build
```

**Backend:**
```bash
cd server && npm install
```

**AI Microservice:**
```bash
cd GeminiAiMicroservice && pip install -r requirements.txt
```

## 📁 Project Structure

```
ai-task-flow/
├── front-end/                 # React frontend application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env
├── server/                    # Node.js backend server
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── package.json
│   └── .env
├── GeminiAiMicroservice/      # Python AI microservice
│   ├── requirements.txt
│   ├── run_server.py
│   └── .env
└── README.md
```

## 🔑 Key Features Explanation

### AI Task Generation
1. User inputs a goal (e.g., "I want to learn React in 2 months")
2. AI analyzes the goal and timeline
3. System generates structured weekly and daily tasks
4. Tasks are automatically organized and prioritized

### Manual Task Management
- Add custom tasks alongside AI-generated ones
- Edit existing tasks
- Mark tasks as complete
- Set custom deadlines and priorities

### Authentication Flow
- Firebase authentication integration
- JWT token-based session management
- Secure API endpoints with middleware protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page for existing solutions
2. Create a new issue with detailed information about the problem
3. Include screenshots and error logs when possible

## 🙏 Acknowledgments

- Google Gemini AI for intelligent task generation
- Firebase for authentication services
- MongoDB for reliable data storage
- The open-source community for the amazing tools and libraries

---

**Happy Task Planning! 🎯**
