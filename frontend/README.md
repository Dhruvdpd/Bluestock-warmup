# Company Registration & Verification Frontend

Production-ready React 19 frontend application for company registration and verification system.

## Tech Stack

- **React**: 19.0.0
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **API Layer**: React Query (@tanstack/react-query)
- **UI Framework**: Material-UI (MUI)
- **Forms**: React Hook Form
- **Routing**: React Router DOM v6
- **Authentication**: Firebase
- **HTTP Client**: Axios
- **Notifications**: React Toastify
- **Phone Input**: React Phone Input 2

## Prerequisites

- Node.js 20.x or higher
- npm or yarn
- Backend API running (see backend README)
- Firebase project configured

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
# API
VITE_API_BASE_URL=http://localhost:5000/api/v1

# Firebase (get these from Firebase Console)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Cloudinary (optional for direct uploads)
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
```

## Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Enable Authentication → Email/Password
4. Enable Authentication → Phone
5. Go to Project Settings → General
6. Copy your Firebase config credentials to `.env`

## Running the Application

### Development Mode
```bash
npm run dev
```
Application will be available at `http://localhost:5173`

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Project Structure

```
frontend/
├── public/                  # Static assets
├── src/
│   ├── api/                # API service layer
│   │   ├── axios.js        # Axios configuration
│   │   ├── authApi.js      # Auth endpoints
│   │   └── companyApi.js   # Company endpoints
│   ├── assets/             # Images, fonts, etc.
│   ├── components/         # Reusable components
│   ├── pages/              # Page components
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── DashboardPage.jsx
│   │   └── CompanySetupPage.jsx
│   ├── store/              # Redux store
│   │   ├── store.js
│   │   └── slices/
│   │       ├── authSlice.js
│   │       └── companySlice.js
│   ├── styles/             # Global styles
│   │   └── theme.js        # MUI theme
│   ├── utils/              # Utility functions
│   │   └── firebase.js     # Firebase config
│   ├── App.jsx             # Main app component
│   └── main.jsx            # Entry point
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Features

### Authentication
- User registration with email/password
- Email verification via Firebase
- Mobile OTP verification
- Secure login with JWT
- Protected routes
- Auto-redirect based on auth state

### Company Management
- Multi-step company registration form
- Company profile dashboard
- Edit company information
- Upload company logo (with preview)
- Upload company banner (with preview)
- Social media links management

### UI/UX
- Responsive design (mobile + desktop)
- Material Design components
- Toast notifications for all actions
- Form validation with error messages
- Loading states
- Progressive image upload with progress
- Smooth transitions

## Key Components

### Protected Routes
Routes that require authentication:
- `/dashboard` - Main dashboard
- `/company-setup` - Company registration/edit

### Public Routes
Routes accessible without authentication:
- `/login` - User login
- `/register` - User registration

### State Management

#### Auth Slice
```javascript
{
  user: null,           // Current user data
  token: null,          // JWT token
  isAuthenticated: false,
  loading: false,
  error: null
}
```

#### Company Slice
```javascript
{
  company: null,        // Company profile data
  loading: false,
  error: null,
  uploadProgress: 0     // Image upload progress
}
```

## API Integration

### Axios Configuration
- Automatic JWT token injection
- Request/response interceptors
- Error handling
- Auto-logout on 401

### React Query
- Automatic caching
- Background refetching
- Loading states
- Error handling
- Optimistic updates

## Form Validation

All forms use React Hook Form with validation:

**Registration Form:**
- Email: Valid email format
- Password: Min 8 chars, uppercase, lowercase, number, special char
- Full Name: Min 2 characters
- Gender: Required selection
- Mobile: Valid phone number format

**Company Setup:**
- Step 1: Company name, address, city, state, country, postal code
- Step 2: Website (valid URL), industry, founded date, description
- Step 3: Social media links (optional)

## Styling

### Theme Customization
Edit `src/styles/theme.js` to customize:
- Color palette
- Typography
- Spacing
- Border radius
- Shadows
- Component styles

### Responsive Breakpoints
```javascript
xs: 0px    // Extra small (mobile)
sm: 600px  // Small (tablet)
md: 900px  // Medium (small laptop)
lg: 1200px // Large (desktop)
xl: 1536px // Extra large (large desktop)
```

## Image Upload

### Requirements
- Max file size: 5MB
- Accepted formats: JPEG, JPG, PNG, GIF, WEBP
- Logo: Recommended 500x500px
- Banner: Recommended 1920x600px

### Upload Flow
1. User selects image
2. Frontend validates file
3. File sent to backend API
4. Backend uploads to Cloudinary
5. URL returned and stored in database
6. Image displayed in UI

## Error Handling

All errors are handled consistently:
```javascript
try {
  // API call
} catch (error) {
  toast.error(error.message);
}
```

Errors are displayed via:
- Toast notifications
- Form field errors
- Error boundaries

## Performance Optimizations

- Code splitting by route
- Lazy loading of components
- Image optimization via Cloudinary
- Memoization of expensive computations
- Debounced API calls
- Optimistic UI updates

## Security Features

- HTTPS only in production
- JWT stored in localStorage
- Auto-logout on token expiration
- Protected API routes
- Input sanitization
- XSS prevention
- CSRF protection

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## Build for Production

1. Update environment variables for production
2. Build the application:
```bash
npm run build
```

3. Deploy the `dist` folder to your hosting service

### Deployment Options
- **Vercel**: Zero config deployment
- **Netlify**: Continuous deployment from Git
- **AWS S3 + CloudFront**: Scalable static hosting
- **Firebase Hosting**: Easy deployment with Firebase CLI

## Troubleshooting

### Firebase Authentication Errors
- Verify Firebase credentials in `.env`
- Check if authentication methods are enabled
- Ensure domain is added to authorized domains

### API Connection Issues
- Verify `VITE_API_BASE_URL` is correct
- Check if backend server is running
- Verify CORS is properly configured

### Build Failures
- Clear node_modules and reinstall
- Check for conflicting dependencies
- Verify Node.js version

## Development Guidelines

1. Follow existing code structure
2. Use TypeScript for type safety (optional)
3. Write meaningful component names
4. Keep components small and focused
5. Use custom hooks for shared logic
6. Follow MUI design patterns
7. Write meaningful commit messages

## Contributing

1. Create feature branch from `main`
2. Make changes
3. Test thoroughly
4. Submit pull request

## License

MIT