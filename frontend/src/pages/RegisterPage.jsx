import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Link as MuiLink,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputAdornment,
  IconButton,
  CircularProgress,
  FormHelperText,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import PhoneInput from 'react-phone-input-2';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';

import { authApi } from '../api/authApi';
import { firebaseService } from '../utils/firebase';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      gender: 'male',
      mobile_no: '',
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data) => {
      await firebaseService.createUser(data.email, data.password);

      return authApi.register({
      email: data.email,
      password: data.password,
      full_name: data.full_name,
      gender: data.gender === 'male' ? 'm' : data.gender === 'female' ? 'f' : 'o',
      mobile_no: data.mobile_no.startsWith('+')
        ? data.mobile_no
        : `+${data.mobile_no}`,
      signup_type: 'e'
    });

    },
    onSuccess: () => {
      toast.success('Registration successful! Please verify your email and mobile number.');
      navigate('/login');
    },
    onError: (error) => {
      toast.error(error.message || 'Registration failed');
    },
  });

  const onSubmit = (data) => registerMutation.mutate(data);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          maxWidth: 1000,
          width: '100%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            flex: 1,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
          }}
        >
          <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
            Image Placeholder
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            flex: 1,
            p: { xs: 3, sm: 6 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
            Register as a Company
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Full Name"
              margin="normal"
              {...register('full_name', { required: 'Full name is required' })}
              error={!!errors.full_name}
              helperText={errors.full_name?.message}
            />

            <TextField
              fullWidth
              label="Email"
              margin="normal"
              {...register('email', { required: 'Email is required' })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <FormControl margin="normal">
              <FormLabel>Gender</FormLabel>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <RadioGroup row {...field}>
                    <FormControlLabel value="male" control={<Radio />} label="Male" />
                    <FormControlLabel value="female" control={<Radio />} label="Female" />
                    <FormControlLabel value="other" control={<Radio />} label="Other" />
                  </RadioGroup>
                )}
              />
              {errors.gender && <FormHelperText error>{errors.gender.message}</FormHelperText>}
            </FormControl>

            <Box sx={{ mt: 2 }}>
              <FormLabel>Mobile Number</FormLabel>
              <Controller
                name="mobile_no"
                control={control}
                rules={{ required: 'Mobile number is required' }}
                render={({ field }) => (
                  <PhoneInput
                    {...field}
                    country="in"
                    inputStyle={{ width: '100%', height: 56 }}
                  />
                )}
              />
              {errors.mobile_no && (
                <FormHelperText error>{errors.mobile_no.message}</FormHelperText>
              )}
            </Box>

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              margin="normal"
              {...register('password', { required: 'Password is required' })}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? <CircularProgress size={24} /> : 'Register'}
            </Button>

            <Typography align="center" sx={{ mt: 2 }}>
              Already have an account?{' '}
              <MuiLink component={Link} to="/login">
                Login
              </MuiLink>
            </Typography>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default RegisterPage;
