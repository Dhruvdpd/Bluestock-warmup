import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Box, TextField, Button, Typography, Paper, Container, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { auth } from '../config/firebase';
import { authApi } from '../api/authApi';
import { setCredentials } from '../store/slices/authSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Login with backend
      const response = await authApi.login({
        email: data.email,
        password: data.password,
      });

      // Store credentials in Redux
      dispatch(setCredentials({
        user: response.data.user,
        token: response.data.token,
      }));

      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      if (error.code === 'auth/user-not-found') {
        toast.error('User not found. Please register first.');
      } else if (error.code === 'auth/wrong-password') {
        toast.error('Invalid email or password');
      } else if (error.code === 'auth/invalid-credential') {
        toast.error('Invalid credentials');
      } else {
        toast.error(error.response?.data?.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
      <Box sx={{ display: 'flex', width: '100%', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Left side - Gradient Box */}
        <Box
          sx={{
            flex: 1,
            background: 'linear-gradient(180deg, #E0C3FC 0%, #8EC5FC 100%)',
            borderRadius: 2,
            minHeight: { xs: 200, md: 400 },
          }}
        />

        {/* Right side - Login Form */}
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <Paper elevation={0} sx={{ p: 4, width: '100%', maxWidth: 400, mx: 'auto' }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Login to Company
            </Typography>

            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                margin="normal"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                margin="normal"
                {...register('password', {
                  required: 'Password is required',
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mt: 3,
                  mb: 2,
                  textTransform: 'none',
                  bgcolor: '#6366F1',
                  '&:hover': { bgcolor: '#4F46E5' },
                }}
              >
                {loading ? 'Logging in...' : 'Login to Dashboard'}
              </Button>

              <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                Don't have an account?{' '}
                <Link to="/register" style={{ color: '#6366F1', textDecoration: 'none' }}>
                  Register here
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;