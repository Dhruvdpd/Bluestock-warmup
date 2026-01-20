# Company Registration & Verification Backend

Production-ready Node.js backend API for company registration and verification system.

## Tech Stack

- **Runtime**: Node.js 20.x LTS
- **Framework**: Express.js
- **Database**: PostgreSQL 15
- **Authentication**: Firebase Admin SDK + JWT
- **File Upload**: Cloudinary
- **Validation**: express-validator
- **Security**: helmet, cors, bcrypt

## Prerequisites

- Node.js 20.x or higher
- PostgreSQL 15 or higher
- Firebase project with Admin SDK credentials
- Cloudinary account

## Installation

```bash
npm install
```

## Environment Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update the following variables in `.env`:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=company_registration_db
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_secure_random_secret_key_here

# Firebase
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Database Setup

1. Create PostgreSQL database:
```bash
createdb company_registration_db
```

2. Import the schema:
```bash
psql -d company_registration_db -f ../database/schema.sql
```

Or download and import from:
```
https://bluestock.in/backoffice-tech/company_db.sql
```

## Firebase Setup

1. Go to Firebase Console → Project Settings → Service Accounts
2. Generate new private key
3. Copy the credentials to your `.env` file
4. Enable Authentication → Email/Password and Phone authentication

## Cloudinary Setup

1. Sign up at https://cloudinary.com
2. Get your Cloud Name, API Key, and API Secret from the Dashboard
3. Add credentials to `.env` file

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Run Tests
```bash
npm test
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

## API Endpoints

### Health Check
```
GET /health
```

### Authentication

#### Register User
```
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass@123",
  "full_name": "John Doe",
  "gender": "m",
  "mobile_no": "+919876543210"
}
```

#### Login
```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass@123",
  "firebaseIdToken": "firebase_token_here"
}
```

#### Verify Email
```
GET /api/v1/auth/verify-email?userId=123
```

#### Verify Mobile
```
POST /api/v1/auth/verify-mobile
Content-Type: application/json

{
  "userId": "123",
  "firebaseIdToken": "firebase_token_here"
}
```

### Company (Protected Routes - Require JWT)

#### Register Company
```
POST /api/v1/company/register
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "company_name": "Tech Corp",
  "address": "123 Tech Street",
  "city": "San Francisco",
  "state": "California",
  "country": "USA",
  "postal_code": "94102",
  "website": "https://techcorp.com",
  "industry": "Technology",
  "founded_date": "2020-01-01",
  "description": "A technology company",
  "social_links": {
    "linkedin": "https://linkedin.com/company/techcorp",
    "twitter": "https://twitter.com/techcorp"
  }
}
```

#### Get Company Profile
```
GET /api/v1/company/profile
Authorization: Bearer <jwt_token>
```

#### Update Company Profile
```
PUT /api/v1/company/profile
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "company_name": "Updated Tech Corp",
  "description": "Updated description"
}
```

#### Upload Company Logo
```
POST /api/v1/company/upload-logo
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

logo: <image_file>
```

#### Upload Company Banner
```
POST /api/v1/company/upload-banner
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

banner: <image_file>
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # PostgreSQL configuration
│   │   ├── firebase.js          # Firebase Admin setup
│   │   └── cloudinary.js        # Cloudinary setup
│   ├── controllers/
│   │   ├── authController.js    # Auth request handlers
│   │   └── companyController.js # Company request handlers
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   └── error.js             # Error handling
│   ├── models/
│   │   ├── userModel.js         # User database operations
│   │   └── companyModel.js      # Company database operations
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   └── companyRoutes.js     # Company endpoints
│   ├── services/
│   │   ├── authService.js       # Auth business logic
│   │   └── companyService.js    # Company business logic
│   ├── tests/
│   │   └── auth.test.js         # API tests
│   ├── utils/
│   │   ├── jwt.js               # JWT utilities
│   │   ├── validators.js        # Input validation
│   │   ├── sanitizer.js         # Input sanitization
│   │   └── upload.js            # File upload utilities
│   └── server.js                # Application entry point
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Security Features

- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Tokens**: 90-day validity
- **Input Validation**: express-validator
- **Input Sanitization**: sanitize-html
- **Security Headers**: helmet
- **CORS**: Configured for specific origins
- **File Upload**: Size limits and type validation

## Error Handling

All errors follow this format:
```json
{
  "success": false,
  "error": {
    "message": "Error description"
  }
}
```

## Testing

Run the test suite:
```bash
npm test
```

Tests cover:
- User registration validation
- Login flow
- Email/Mobile verification
- Protected route access
- Input validation

## Production Deployment

1. Set `NODE_ENV=production` in environment
2. Use strong `JWT_SECRET`
3. Configure production database
4. Set up SSL/TLS certificates
5. Configure reverse proxy (nginx/Apache)
6. Set up process manager (PM2)
7. Configure logging and monitoring
8. Set up backup strategy for database

### PM2 Example
```bash
npm install -g pm2
pm2 start src/server.js --name company-api
pm2 save
pm2 startup
```

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists and schema is imported

### Firebase Authentication Errors
- Verify Firebase credentials are correct
- Check if authentication methods are enabled in Firebase Console
- Ensure private key format is correct (with `\n` for line breaks)

### Cloudinary Upload Failures
- Verify Cloudinary credentials
- Check file size limits
- Ensure proper file format

## Contributing

1. Follow the existing code structure
2. Write tests for new features
3. Update documentation
4. Follow ESM module syntax
5. Use meaningful commit messages

## License

MIT