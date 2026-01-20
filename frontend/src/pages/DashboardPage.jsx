import { useState, useEffect } from 'react';
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
  Chip,
  AppBar,
  Toolbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Business as BusinessIcon,
  Edit as EditIcon,
  Upload as UploadIcon,
  ExitToApp as LogoutIcon,
  Language as LanguageIcon,
  LocationOn as LocationIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { companyApi } from '../api/companyApi';
import { fileToBase64 } from '../config/cloudinary';
import { setCompany, clearCompany } from '../store/slices/companySlice';
import { logout } from '../store/slices/authSlice';

const DashboardPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { user } = useSelector((state) => state.auth);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const {
    data: companyData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['company-profile'],
    queryFn: companyApi.getCompany,
    retry: false,
  });

  const company = companyData?.data?.company;

  useEffect(() => {
    if (company) {
      dispatch(setCompany(company));
    }
  }, [company, dispatch]);

  const logoMutation = useMutation({
    mutationFn: async (file) => {
      const base64 = await fileToBase64(file);
      return companyApi.uploadLogo(base64);
    },
    onSuccess: (response) => {
      dispatch(setCompany(response.data.company));
      queryClient.invalidateQueries(['company-profile']);
      toast.success('Logo uploaded successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to upload logo');
    },
  });

  const bannerMutation = useMutation({
    mutationFn: async (file) => {
      const base64 = await fileToBase64(file);
      return companyApi.uploadBanner(base64);
    },
    onSuccess: (response) => {
      dispatch(setCompany(response.data.company));
      queryClient.invalidateQueries(['company-profile']);
      toast.success('Banner uploaded successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to upload banner');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: companyApi.deleteCompany,
    onSuccess: () => {
      dispatch(clearCompany());
      queryClient.invalidateQueries(['company-profile']);
      toast.success('Company profile deleted successfully');
      setDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete company');
    },
  });

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed');
      return;
    }

    logoMutation.mutate(file);
  };

  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed');
      return;
    }

    bannerMutation.mutate(file);
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCompany());
    toast.info('Logged out successfully');
    navigate('/login');
  };

  const handleDeleteCompany = () => {
    deleteMutation.mutate();
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

  if (isError || !company) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Company Dashboard
            </Typography>
            <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>

        <Container maxWidth="md" sx={{ py: 8 }}>
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <BusinessIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 3 }} />
            <Typography variant="h4" gutterBottom>
              No Company Profile Found
            </Typography>
            <Typography sx={{ my: 2, mb: 4 }} color="text.secondary">
              You haven't set up your company profile yet. Create one to get started!
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/company-setup')}
            >
              Setup Company Profile
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* App Bar */}
      <AppBar position="static">
        <Toolbar>
          <BusinessIcon sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Company Dashboard
          </Typography>
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Banner and Logo Section */}
        <Paper sx={{ mb: 4, position: 'relative', overflow: 'hidden' }}>
          <Box
            sx={{
              height: 250,
              background: company.banner_url
                ? `url(${company.banner_url}) center/cover`
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              position: 'relative',
            }}
          >
            {bannerMutation.isPending && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  bgcolor: 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CircularProgress sx={{ color: 'white' }} />
              </Box>
            )}
            <IconButton
              component="label"
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                bgcolor: 'white',
                '&:hover': { bgcolor: 'grey.100' },
              }}
              disabled={bannerMutation.isPending}
            >
              <UploadIcon />
              <input hidden type="file" accept="image/*" onChange={handleBannerUpload} />
            </IconButton>
          </Box>

          <Box sx={{ p: 3, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={company.logo_url}
                sx={{
                  width: 120,
                  height: 120,
                  mt: -8,
                  border: '4px solid white',
                  boxShadow: 3,
                }}
              >
                <BusinessIcon sx={{ fontSize: 60 }} />
              </Avatar>
              {logoMutation.isPending && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'rgba(255,255,255,0.8)',
                    borderRadius: '50%',
                  }}
                >
                  <CircularProgress size={30} />
                </Box>
              )}
              <IconButton
                component="label"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' },
                  width: 35,
                  height: 35,
                }}
                disabled={logoMutation.isPending}
              >
                <UploadIcon fontSize="small" />
                <input hidden type="file" accept="image/*" onChange={handleLogoUpload} />
              </IconButton>
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h4" fontWeight="bold" noWrap>
                {company.company_name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap' }}>
                <Chip icon={<BusinessIcon />} label={company.industry} />
                <Chip
                  icon={<LocationIcon />}
                  label={`${company.city}, ${company.country}`}
                />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => navigate('/company-setup')}
              >
                Edit Profile
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteDialogOpen(true)}
              >
                Delete
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Main Content */}
        <Grid container spacing={3}>
          {/* Company Information */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  About Company
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography paragraph>
                  {company.description || 'No description provided'}
                </Typography>

                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Contact Information
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                    {company.website && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LanguageIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: 'inherit' }}
                          >
                            {company.website}
                          </a>
                        </Typography>
                      </Box>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {company.address}, {company.city}, {company.state},{' '}
                        {company.postal_code}
                      </Typography>
                    </Box>
                    {company.founded_date && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          Founded: {new Date(company.founded_date).getFullYear()}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>

                {company.social_links &&
                  Object.keys(company.social_links).length > 0 && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Social Links
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                        {Object.entries(company.social_links).map(([platform, url]) => (
                          <Chip
                            key={platform}
                            label={platform}
                            component="a"
                            href={url}
                            target="_blank"
                            clickable
                            sx={{ textTransform: 'capitalize' }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
              </CardContent>
            </Card>
          </Grid>

          {/* User Information */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Account Details
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Full Name
                    </Typography>
                    <Typography variant="body1">{user?.full_name}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Email
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2">{user?.email}</Typography>
                      {user?.is_email_verified && (
                        <Chip label="Verified" size="small" color="success" />
                      )}
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Mobile
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2">{user?.mobile_no}</Typography>
                      {user?.is_mobile_verified && (
                        <Chip label="Verified" size="small" color="success" />
                      )}
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Gender
                    </Typography>
                    <Typography variant="body1">
                      {user?.gender === 'm'
                        ? 'Male'
                        : user?.gender === 'f'
                        ? 'Female'
                        : 'Other'}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Company Profile?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete your company profile? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteCompany}
            color="error"
            variant="contained"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardPage;