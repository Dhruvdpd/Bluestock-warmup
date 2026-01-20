# Company Registration & Verification Module

Complete, production-ready MERN-style application for company registration and verification with email/SMS verification, JWT authentication, and image uploads.

## 🚀 Features

### Authentication & Security
- Firebase Authentication (email/password)
- Email verification via Firebase
- Mobile number verification via Firebase SMS OTP
- JWT-based session management (90-day expiry)
- bcrypt password hashing
- Input validation and sanitization
- Rate limiting
- Security headers (Helmet)
- CORS protection

### Company Management
- Multi-step company registration form
- Complete company profile management
- Logo upload to Cloudinary (max 5MB)
- Banner upload to Cloudinary (max 10MB)
- Profile editing capabilities
- Real-time validation

### User Experience
- Responsive Material-UI design
- Multi-step form with progress indicator
- Toast notifications for all actions
- Protected routes
- Persistent authentication
- Loading states and error handling

## 📋 Tech Stack

### Frontend
- React 19
- Vite
- Redux Toolkit
- Material-UI v5
- React Router v6
- React Query (TanStack Query)
- React Hook Form
- Firebase Web SDK
- Axios
- React Phone Input 2
- React Toastify

### Backend
- Node.js 20.x
- Express
- PostgreSQL 15+
- Firebase Admin SDK
- Cloudinary
- bcrypt
- jsonwebtoken
- express-validator
- Helmet, CORS, Compression

## 📁 Project Structure

```
company-registration/
├── backend/
│   ├── src/
│   │   ├── config/          # Database, Firebase, Cloudinary configs
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   └── server.js        # Application entry point
│   ├── .env
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── api/             # API calls
│   │   ├── components/      # React components
│   │   ├── config/          # Firebase config
│   │   ├── pages/           # Page components
│   │   ├── store/           # Redux store & slices
│   │   ├── styles/          # Global styles
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── package.json
│   └── README.md
└── README.md
```

## 🗄️ Database Schema

The application uses PostgreSQL with two main tables:

### users
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firebase_uid VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    is_email_verified BOOLEAN DEFAULT FALSE,
    is_mobile_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### company_profile
```sql
CREATE TABLE company_profile (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(200) NOT NULL,
    company_type VARCHAR(100) NOT NULL,
    registration_number VARCHAR(100) NOT NULL,
    tax_id VARCHAR(100),
    industry VARCHAR(100) NOT NULL,
    website VARCHAR(255),
    description TEXT,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    employee_count INTEGER,
    year_founded INTEGER,
    logo_url TEXT,
    logo_public_id VARCHAR(255),
    banner_url TEXT,
    banner_public_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🚀 Getting Started

### Prerequisites

1. Node.js 20.x or higher
2. PostgreSQL 15+ installed and running
3. Firebase project with Authentication enabled
4. Cloudinary account
5. Database `company_db` created with schema

### Installation

#### 1. Backend Setup

```bash
cd backend
npm install
```

Configure `.env` with your credentials:
- Database connection details
- Firebase Admin SDK credentials
- Cloudinary credentials
- JWT secret

Start the backend:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

#### 2. Frontend Setup

```bash
cd frontend
npm install
```

Configure `.env` with your credentials:
- API base URL
- Firebase Web SDK config
- Cloudinary config

Start the frontend:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

### Database Setup

1. Ensure PostgreSQL is running
2. Create database:
```sql
CREATE DATABASE company_db;
```

3. Connect to the database and run the schema:
```bash
psql -U postgres -d company_db -f database/schema.sql
```

## 📡 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/verify-email` - Verify email
- `POST /api/v1/auth/verify-mobile` - Verify mobile number
- `GET /api/v1/auth/me` - Get current user

### Company
- `POST /api/v1/company/register` - Register company
- `GET /api/v1/company/profile` - Get company profile
- `PUT /api/v1/company/profile` - Update company profile
- `POST /api/v1/company/upload-logo` - Upload company logo
- `POST /api/v1/company/upload-banner` - Upload company banner

All protected endpoints require:
```
Authorization: Bearer <JWT_TOKEN>
```

## 🔐 Authentication Flow

### Registration
1. User submits registration form
2. Firebase creates user account
3. Firebase sends email verification
4. Backend creates user record in database
5. User receives success notification

### Login
1. User submits credentials
2. Firebase authenticates user
3. Frontend receives Firebase ID token
4. Backend verifies token with Firebase
5. Backend issues JWT (90-day expiry)
6. User redirected to dashboard

### Verification
- Email: Firebase handles automatically
- Mobile: Firebase SMS OTP verification
- Backend updates verification status

## 🎨 User Interface

### Pages
- **Register** - User registration with validation
- **Login** - User authentication
- **Dashboard** - Main hub with company overview
- **Company Register** - Multi-step form (3 steps)
- **Profile** - User and company details with image upload

### Features
- Fully responsive design
- Material-UI components
- Form validation with real-time feedback
- Loading indicators
- Error handling with toast notifications
- Protected routes with automatic redirects

## 🛡️ Security Features

- Password hashing with bcrypt (10 rounds)
- JWT token authentication (90-day expiry)
- Firebase Admin SDK verification
- Input validation (express-validator)
- HTML sanitization (sanitize-html)
- SQL injection prevention (parameterized queries)
- XSS protection
- Rate limiting (100 req/15 min)
- Helmet security headers
- CORS configuration
- Phone number validation

## 📦 Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5000
API_VERSION=v1
DB_HOST=localhost
DB_PORT=5432
DB_NAME=company_db
DB_USER=postgres
DB_PASSWORD=123456
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=90d
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY=your_private_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

## 🧪 Testing

Both backend and frontend include comprehensive error handling and validation.

Backend health check:
```
GET http://localhost:5000/health
```

## 📝 Notes

- Database schema must exist before running the application
- Backend does NOT create tables automatically
- JWT tokens expire after 90 days
- Logo uploads limited to 5MB
- Banner uploads limited to 10MB
- Images automatically optimized by Cloudinary
- Rate limiting applies per IP address

## 🔧 Troubleshooting

### Backend won't start
- Check PostgreSQL is running
- Verify database exists
- Check `.env` credentials
- Ensure port 5000 is available

### Frontend won't start
- Check backend is running
- Verify `.env` configuration
- Clear `node_modules` and reinstall
- Ensure port 5173 is available

### Authentication issues
- Verify Firebase credentials
- Check JWT secret matches
- Clear localStorage in browser
- Verify user exists in database

### Image upload fails
- Check file size limits
- Verify Cloudinary credentials
- Ensure company profile exists
- Check network connectivity

## 📞 Support

For detailed documentation:
- Backend: See `backend/README.md`
- Frontend: See `frontend/README.md`

## 🙏 Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Use environment-specific database
3. Configure production Firebase credentials
4. Set secure JWT secret
5. Enable SSL/TLS
6. Configure reverse proxy (nginx)
7. Set up process manager (PM2)

### Frontend
1. Build for production: `npm run build`
2. Deploy `dist` folder to hosting
3. Configure production API URL
4. Set up CDN for static assets
5. Enable HTTPS

## 📄 License

This project is proprietary and confidential.

---

**Built with ❤️ using React, Node.js, PostgreSQL, Firebase, and Cloudinary**