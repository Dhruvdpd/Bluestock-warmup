import React, { useState } from 'react';
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
  Chip,
  Card,
  CardContent,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Business as BusinessIcon,
  People as PeopleIcon,
  Description as DescriptionIcon,
  Warning as WarningIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  Language as LanguageIcon,
  LocationOn as LocationOnIcon,
  CalendarToday as CalendarIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import SidebarLayout from '../components/SidebarLayout';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const { data: companyData, isLoading } = useQuery({
    queryKey: ['company-profile'],
    queryFn: companyApi.getCompany,
    retry: false,
  });

  const company = companyData?.data?.company;

  const stats = [
    {
      label: 'Company Status',
      value: company ? 'Active' : 'Pending Setup',
      icon: BusinessIcon,
      color: company ? '#10B981' : '#F59E0B',
      bgColor: company ? '#D1FAE5' : '#FEF3C7',
    },
    {
      label: 'Team Members',
      value: '1',
      icon: PeopleIcon,
      color: '#3B82F6',
      bgColor: '#DBEAFE',
    },
    {
      label: 'Documents',
      value: '0',
      icon: DescriptionIcon,
      color: '#8B5CF6',
      bgColor: '#EDE9FE',
    },
    {
      label: 'Pending Actions',
      value: company ? '0' : '1',
      icon: WarningIcon,
      color: '#EF4444',
      bgColor: '#FEE2E2',
    },
  ];

  if (isLoading) {
    return (
      <SidebarLayout>
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
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Dashboard
          </Typography>
          <Typography color="text.secondary">
            Welcome back! Here's an overview of your account.
          </Typography>
        </Box>

        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                elevation={0}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                  transition: 'all 0.3s',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {stat.label}
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {stat.value}
                      </Typography>
                    </Box>
                    <Avatar
                      sx={{
                        bgcolor: stat.bgColor,
                        color: stat.color,
                        width: 48,
                        height: 48,
                      }}
                    >
                      <stat.icon />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Company Profile Section */}
        {company ? (
          <Grid container spacing={3}>
            {/* Company Overview Card */}
            <Grid item xs={12} md={8}>
              <Card
                elevation={0}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h5" fontWeight="bold">
                      Company Profile
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        variant="outlined"
                        startIcon={<VisibilityIcon />}
                        onClick={() => setViewDialogOpen(true)}
                      >
                        View Details
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={() => navigate('/company-setup')}
                      >
                        Edit Profile
                      </Button>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                    <Avatar
                      src={company.logo_url}
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: 'primary.main',
                        fontSize: '2rem',
                      }}
                    >
                      {company.company_name?.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {company.company_name}
                      </Typography>
                      <Chip
                        label={company.industry}
                        size="small"
                        sx={{ bgcolor: 'primary.50', color: 'primary.main', fontWeight: 600 }}
                      />
                    </Box>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <LocationOnIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Location
                          </Typography>
                          <Typography variant="body2" fontWeight="500">
                            {company.city}, {company.state}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <CalendarIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Founded
                          </Typography>
                          <Typography variant="body2" fontWeight="500">
                            {company.founded_date ? new Date(company.founded_date).getFullYear() : 'N/A'}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    {company.website && (
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LanguageIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Website
                            </Typography>
                            <Typography
                              variant="body2"
                              fontWeight="500"
                              component="a"
                              href={company.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{ color: 'primary.main', textDecoration: 'none' }}
                            >
                              {company.website}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Quick Actions Card */}
            <Grid item xs={12} md={4}>
              <Card
                elevation={0}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Quick Actions
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<EditIcon />}
                      onClick={() => navigate('/company-setup')}
                      sx={{ justifyContent: 'flex-start', py: 1.5 }}
                    >
                      Edit Company Profile
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<DescriptionIcon />}
                      sx={{ justifyContent: 'flex-start', py: 1.5 }}
                    >
                      Upload Documents
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<PeopleIcon />}
                      sx={{ justifyContent: 'flex-start', py: 1.5 }}
                    >
                      Manage Team
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : (
          /* Setup Prompt */
          <Card
            elevation={0}
            sx={{
              border: '2px solid',
              borderColor: 'primary.main',
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: 'primary.light',
                  }}
                >
                  <BusinessIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Complete Your Company Profile
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 3 }}>
                    You haven't set up your company profile yet. Complete your registration to unlock all features and start managing your company.
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/company-setup')}
                  >
                    Setup Company Profile
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}
      </Container>

      {/* View Company Details Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h5" fontWeight="bold">
              Company Details
            </Typography>
            <IconButton onClick={() => setViewDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {company && (
            <Box>
              {/* Banner */}
              {company.banner_url && (
                <Box
                  sx={{
                    width: '100%',
                    height: 200,
                    borderRadius: 2,
                    overflow: 'hidden',
                    mb: 3,
                  }}
                >
                  <img
                    src={company.banner_url}
                    alt="Company Banner"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
              )}

              {/* Logo and Name */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar
                  src={company.logo_url}
                  sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: '2rem' }}
                >
                  {company.company_name?.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {company.company_name}
                  </Typography>
                  <Chip label={company.industry} size="small" color="primary" />
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Details Grid */}
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Address
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {company.address}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    City
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {company.city}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    State
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {company.state}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Country
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {company.country}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Postal Code
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {company.postal_code}
                  </Typography>
                </Grid>
                {company.founded_date && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Founded Date
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {new Date(company.founded_date).toLocaleDateString()}
                    </Typography>
                  </Grid>
                )}
                {company.website && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Website
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight="500"
                      component="a"
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ color: 'primary.main', textDecoration: 'none' }}
                    >
                      {company.website}
                    </Typography>
                  </Grid>
                )}
                {company.description && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Description
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {company.description}
                    </Typography>
                  </Grid>
                )}
              </Grid>

              {/* Social Links */}
              {company.social_links && Object.keys(company.social_links).length > 0 && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Social Links
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {Object.entries(company.social_links).map(([platform, url]) => (
                      <Chip
                        key={platform}
                        label={platform}
                        component="a"
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        clickable
                        sx={{ textTransform: 'capitalize' }}
                      />
                    ))}
                  </Box>
                </>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </SidebarLayout>
  );
};

export default DashboardPage;