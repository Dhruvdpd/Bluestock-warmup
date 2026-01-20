import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Avatar,
  Divider,
  IconButton,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import {
  Business as BusinessIcon,
  Edit as EditIcon,
  Upload as UploadIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useQuery, useMutation } from '@tanstack/react-query';

import { companyApi } from '../api/companyApi';
import { setCompany } from '../store/slices/companySlice';
import { logout } from '../store/slices/authSlice';

const DashboardPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { company } = useSelector((state) => state.company);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['company-profile'],
    queryFn: companyApi.getProfile,
    retry: false,
  });

  useEffect(() => {
    if (data?.data?.company) {
      dispatch(setCompany(data.data.company));
    }
  }, [data, dispatch]);

  const logoMutation = useMutation({
    mutationFn: companyApi.uploadLogo,
    onSuccess: (response) => {
      dispatch(setCompany(response.data.company));
      toast.success('Logo uploaded successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to upload logo');
    },
  });

  const bannerMutation = useMutation({
    mutationFn: companyApi.uploadBanner,
    onSuccess: (response) => {
      dispatch(setCompany(response.data.company));
      toast.success('Banner uploaded successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to upload banner');
    },
  });

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    logoMutation.mutate(file);
  };

  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    bannerMutation.mutate(file);
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.info('Logged out successfully');
    navigate('/login');
  };

  if (isLoading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !company) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <BusinessIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5">No Company Profile Found</Typography>
          <Typography sx={{ my: 2 }} color="text.secondary">
            You haven't set up your company profile yet.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/company-setup')}>
            Setup Company Profile
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          px: 3,
          py: 2,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h5">Company Dashboard</Typography>
        <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ mb: 4, position: 'relative' }}>
          <Box
            sx={{
              height: 250,
              background: company.banner_url
                ? `url(${company.banner_url}) center/cover`
                : 'linear-gradient(135deg,#667eea,#764ba2)',
            }}
          />
          <IconButton component="label" sx={{ position: 'absolute', top: 16, right: 16, bgcolor: 'white' }}>
            <UploadIcon />
            <input hidden type="file" accept="image/*" onChange={handleBannerUpload} />
          </IconButton>

          <Box sx={{ p: 3, display: 'flex', gap: 3 }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar src={company.logo_url} sx={{ width: 120, height: 120, mt: -8 }}>
                <BusinessIcon />
              </Avatar>
              <IconButton component="label" sx={{ position: 'absolute', bottom: 0, right: 0 }}>
                <UploadIcon />
                <input hidden type="file" accept="image/*" onChange={handleLogoUpload} />
              </IconButton>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="h4">{company.company_name}</Typography>
              <Typography color="text.secondary">
                {company.industry} • {company.city}, {company.country}
              </Typography>
            </Box>

            <Button startIcon={<EditIcon />} onClick={() => navigate('/company-setup')}>
              Edit Profile
            </Button>
          </Box>
        </Paper>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6">Company Info</Typography>
                <Divider sx={{ my: 2 }} />
                <Typography>{company.description || 'No description provided'}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">User Info</Typography>
                <Divider sx={{ my: 2 }} />
                <Typography>{user?.full_name}</Typography>
                <Typography>{user?.email}</Typography>
                <Typography>{user?.mobile_no}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default DashboardPage;
