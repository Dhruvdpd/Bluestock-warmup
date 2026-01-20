import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { companyApi } from '../api/companyApi';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import {
  Business as Building2,
  People as Users,
  Description as FileCheck,
  Warning as AlertCircle,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { toast } from 'react-toastify';

const DashboardPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const { data: companyData, isLoading } = useQuery({
    queryKey: ['company-profile'],
    queryFn: companyApi.getCompany,
    retry: false,
  });

  const profile = companyData?.data?.company;

  const stats = [
    {
      label: 'Company Status',
      value: profile ? 'Active' : 'Pending',
      icon: Building2,
      color: profile ? 'success.main' : 'warning.main',
    },
    {
      label: 'Team Members',
      value: '0',
      icon: Users,
      color: 'info.main',
    },
    {
      label: 'Documents',
      value: '0',
      icon: FileCheck,
      color: 'warning.main',
    },
    {
      label: 'Pending Actions',
      value: profile ? '0' : '1',
      icon: AlertCircle,
      color: 'error.main',
    },
  ];

  const handleLogout = () => {
    dispatch(logout());
    toast.info('Logged out successfully');
    navigate('/login');
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          {/* Welcome Section */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Welcome back, {user?.full_name || 'User'}!
            </Typography>
            <Typography color="text.secondary">
              Here's an overview of your company's status and activities.
            </Typography>
          </Paper>

          {/* Stats Grid */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper
                  sx={{
                    p: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: 'grey.100',
                      color: stat.color,
                    }}
                  >
                    <stat.icon sx={{ fontSize: 32 }} />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                    <Typography variant="h5" fontWeight="bold">
                      {stat.value}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Company Registration Prompt */}
          {!profile && (
            <Paper
              sx={{
                p: 3,
                borderLeft: 4,
                borderColor: 'primary.main',
                mb: 3,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'primary.light',
                    borderRadius: 2,
                  }}
                >
                  <Building2 sx={{ fontSize: 32, color: 'primary.main' }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight="semibold" gutterBottom>
                    Complete Your Company Profile
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 2 }}>
                    You haven't completed your company registration yet. Complete your
                    profile to unlock all features.
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/company-setup')}
                  >
                    Complete Registration
                  </Button>
                </Box>
              </Box>
            </Paper>
          )}

          {/* Quick Actions */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="semibold" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6} md={4}>
                <Paper
                  sx={{
                    p: 2,
                    border: 1,
                    borderColor: 'divider',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: 'primary.50',
                    },
                  }}
                  onClick={() => navigate('/company-setup')}
                >
                  <Typography variant="subtitle1" fontWeight="medium">
                    {profile ? 'Edit Company Profile' : 'Setup Company'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {profile
                      ? 'Update your company details'
                      : 'Create your company profile'}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Paper
                  sx={{
                    p: 2,
                    border: 1,
                    borderColor: 'divider',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: 'primary.50',
                    },
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="medium">
                    Upload Documents
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Submit verification documents
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Paper
                  sx={{
                    p: 2,
                    border: 1,
                    borderColor: 'divider',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: 'primary.50',
                    },
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="medium">
                    View Reports
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Access your analytics
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default DashboardPage;