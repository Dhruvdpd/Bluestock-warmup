import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import PhoneInput from 'react-phone-input-2';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  FormLabel,
  FormHelperText,
  Chip,
} from '@mui/material';
import {
  PhotoCamera,
  Add as Plus,
  Delete as Trash2,
  Person,
  Business,
  Link as LinkIcon,
  Lock,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../store/slices/authSlice';
import { setCompany } from '../store/slices/companySlice';
import { userApi } from '../api/userApi';
import { companyApi } from '../api/companyApi';
import { fileToBase64 } from '../config/cloudinary';
import SidebarLayout from '../components/SidebarLayout';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const menuItems = [
    { id: 'personal', label: 'Personal', icon: <PhotoCamera /> },
    { id: 'profile', label: 'Profile Info', icon: <Person /> },
    { id: 'social', label: 'Social Links', icon: <LinkIcon /> },
    { id: 'account', label: 'Account', icon: <Lock /> },
  ];

  return (
    <SidebarLayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', gap: 4 }}>
          {/* Settings Sidebar Menu */}
          <Paper
            elevation={0}
            sx={{
              width: 280,
              height: 'fit-content',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 3,
              overflow: 'hidden',
            }}
          >
            <Box sx={{ p: 3, bgcolor: 'primary.main', color: 'white' }}>
              <Typography variant="h6" fontWeight="bold">
                Settings
              </Typography>
            </Box>
            <List sx={{ p: 2 }}>
              {menuItems.map((item) => (
                <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
                  <ListItemButton
                    selected={activeTab === item.id}
                    onClick={() => setActiveTab(item.id)}
                    sx={{
                      borderRadius: 2,
                      '&.Mui-selected': {
                        bgcolor: 'primary.light',
                        color: 'primary.main',
                        '&:hover': {
                          bgcolor: 'primary.light',
                        },
                        '& .MuiListItemIcon-root': {
                          color: 'primary.main',
                        },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Paper>

          {/* Settings Content */}
          <Box sx={{ flex: 1 }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3,
              }}
            >
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {menuItems.find((item) => item.id === activeTab)?.label}
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 4 }}>
                Manage your settings and preferences
              </Typography>

              {activeTab === 'personal' && <PersonalTab />}
              {activeTab === 'profile' && <ProfileInfoTab />}
              {activeTab === 'social' && <SocialLinksTab />}
              {activeTab === 'account' && (
                <AccountTab setDeleteDialogOpen={setDeleteDialogOpen} />
              )}
            </Paper>
          </Box>
        </Box>

        {/* Delete Account Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Delete Account?</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete your account? This action cannot be undone and
              all your data will be permanently deleted.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                toast.info('Account deletion requested');
                setDeleteDialogOpen(false);
              }}
              color="error"
              variant="contained"
            >
              Delete Account
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </SidebarLayout>
  );
};

// Personal Tab Component - Banner and Logo Upload
const PersonalTab = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [bannerPreview, setBannerPreview] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const { data: companyData } = useQuery({
    queryKey: ['company-profile'],
    queryFn: companyApi.getCompany,
    retry: false,
  });

  const company = companyData?.data?.company;

  useEffect(() => {
    if (company) {
      setBannerPreview(company.banner_url);
      setLogoPreview(company.logo_url);
    }
  }, [company]);

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

  const handleBannerChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result);
      };
      reader.readAsDataURL(file);
      bannerMutation.mutate(file);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
      logoMutation.mutate(file);
    }
  };

  if (!company) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Business sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          No Company Profile Found
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Please create a company profile first to manage images
        </Typography>
        <Button variant="contained" onClick={() => (window.location.href = '/company-setup')}>
          Create Company Profile
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography variant="h6" fontWeight="medium" gutterBottom>
            Banner Image
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Recommended size: 1920x600px. Max file size: 10MB
          </Typography>
          <Box
            sx={{
              position: 'relative',
              height: 200,
              bgcolor: 'grey.100',
              borderRadius: 2,
              overflow: 'hidden',
              border: 2,
              borderStyle: 'dashed',
              borderColor: 'divider',
              cursor: 'pointer',
              '&:hover': {
                borderColor: 'primary.main',
              },
            }}
          >
            {bannerPreview ? (
              <img
                src={bannerPreview}
                alt="Banner"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                }}
              >
                <PhotoCamera sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                <Typography color="text.secondary">Click to upload banner</Typography>
              </Box>
            )}
            {bannerMutation.isPending && (
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  bgcolor: 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CircularProgress sx={{ color: 'white' }} />
              </Box>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleBannerChange}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: 0,
                cursor: 'pointer',
              }}
              disabled={bannerMutation.isPending}
            />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" fontWeight="medium" gutterBottom>
            Company Logo
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Recommended size: 200x200px. Max file size: 5MB
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box
              sx={{
                position: 'relative',
                width: 120,
                height: 120,
                bgcolor: 'grey.100',
                borderRadius: '50%',
                overflow: 'hidden',
                border: 2,
                borderStyle: 'dashed',
                borderColor: 'divider',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: 'primary.main',
                },
              }}
            >
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Logo"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                  }}
                >
                  <PhotoCamera sx={{ fontSize: 32, color: 'text.secondary' }} />
                </Box>
              )}
              {logoMutation.isPending && (
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    bgcolor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CircularProgress size={30} sx={{ color: 'white' }} />
                </Box>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0,
                  cursor: 'pointer',
                }}
                disabled={logoMutation.isPending}
              />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Upload a company logo with transparent background for best results
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

// Profile Info Tab Component
const ProfileInfoTab = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      full_name: user?.full_name || '',
      email: user?.email || '',
      mobile_no: user?.mobile_no || '',
      gender: user?.gender || 'm',
    },
  });

  const updateMutation = useMutation({
    mutationFn: userApi.updateProfile,
    onSuccess: (response) => {
      dispatch(setUser(response.data.user));
      toast.success('Profile updated successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });

  const onSubmit = (data) => {
    updateMutation.mutate({
      full_name: data.full_name,
      gender: data.gender,
      mobile_no: data.mobile_no,
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3} sx={{ maxWidth: 600 }}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Full Name"
            {...register('full_name', { required: 'Full name is required' })}
            error={!!errors.full_name}
            helperText={errors.full_name?.message}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            {...register('email')}
            disabled
            helperText="Email cannot be changed"
          />
        </Grid>

        <Grid item xs={12}>
          <FormLabel>Mobile Number</FormLabel>
          <Controller
            name="mobile_no"
            control={control}
            rules={{ required: 'Mobile number is required' }}
            render={({ field }) => (
              <PhoneInput
                {...field}
                country="in"
                inputStyle={{
                  width: '100%',
                  height: '56px',
                  fontSize: '16px',
                }}
                containerStyle={{
                  marginTop: '8px',
                }}
              />
            )}
          />
          {errors.mobile_no && (
            <FormHelperText error>{errors.mobile_no.message}</FormHelperText>
          )}
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            select
            label="Gender"
            {...register('gender')}
            SelectProps={{ native: true }}
          >
            <option value="m">Male</option>
            <option value="f">Female</option>
            <option value="o">Other</option>
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Update Profile'
            )}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

// Social Links Tab Component
const SocialLinksTab = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [links, setLinks] = useState([{ platform: 'LinkedIn', url: '' }]);

  const { data: companyData } = useQuery({
    queryKey: ['company-profile'],
    queryFn: companyApi.getCompany,
    retry: false,
  });

  const company = companyData?.data?.company;

  useEffect(() => {
    if (company?.social_links && Object.keys(company.social_links).length > 0) {
      const linksArray = Object.entries(company.social_links).map(([platform, url]) => ({
        platform,
        url,
      }));
      setLinks(linksArray);
    }
  }, [company]);

  const updateMutation = useMutation({
    mutationFn: (data) => companyApi.updateCompany(data),
    onSuccess: (response) => {
      dispatch(setCompany(response.data.company));
      queryClient.invalidateQueries(['company-profile']);
      toast.success('Social links updated successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update social links');
    },
  });

  const addLink = () => {
    setLinks([...links, { platform: '', url: '' }]);
  };

  const removeLink = (index) => {
    if (links.length > 1) {
      setLinks(links.filter((_, i) => i !== index));
    }
  };

  const handleSave = () => {
    if (!company) {
      toast.error('Please create a company profile first');
      return;
    }

    const socialLinksObj = {};
    links.forEach((link) => {
      if (link.platform && link.url) {
        socialLinksObj[link.platform] = link.url;
      }
    });

    updateMutation.mutate({
      ...company,
      social_links: Object.keys(socialLinksObj).length > 0 ? socialLinksObj : null,
    });
  };

  if (!company) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <LinkIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          No Company Profile Found
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Please create a company profile first to add social links
        </Typography>
        <Button variant="contained" onClick={() => (window.location.href = '/company-setup')}>
          Create Company Profile
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 700 }}>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Add your company's social media profiles to help others connect with you.
      </Typography>

      <Grid container spacing={2}>
        {links.map((link, index) => (
          <React.Fragment key={index}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                select
                label="Platform"
                value={link.platform}
                onChange={(e) => {
                  const newLinks = [...links];
                  newLinks[index].platform = e.target.value;
                  setLinks(newLinks);
                }}
                SelectProps={{ native: true }}
              >
                <option value="">Select</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Twitter">Twitter</option>
                <option value="Facebook">Facebook</option>
                <option value="Instagram">Instagram</option>
                <option value="YouTube">YouTube</option>
                <option value="GitHub">GitHub</option>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={7}>
              <TextField
                fullWidth
                label="URL"
                placeholder="https://"
                value={link.url}
                onChange={(e) => {
                  const newLinks = [...links];
                  newLinks[index].url = e.target.value;
                  setLinks(newLinks);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={1}>
              <IconButton
                color="error"
                onClick={() => removeLink(index)}
                disabled={links.length === 1}
              >
                <Trash2 />
              </IconButton>
            </Grid>
          </React.Fragment>
        ))}
      </Grid>

      <Button
        startIcon={<Plus />}
        onClick={addLink}
        sx={{ mt: 2, mb: 3 }}
        variant="outlined"
      >
        Add Social Link
      </Button>

      <Box>
        <Button
          variant="contained"
          size="large"
          onClick={handleSave}
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Save Changes'
          )}
        </Button>
      </Box>
    </Box>
  );
};

// Account Tab Component
const AccountTab = ({ setDeleteDialogOpen }) => {
  const { user } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();
  const newPassword = watch('new_password');

  const onSubmit = (data) => {
    // In a real app, this would call an API to change password
    toast.success('Password changed successfully!');
    reset();
  };

  return (
    <Box sx={{ maxWidth: 700 }}>
      {/* Account Information */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h6" fontWeight="semibold" gutterBottom>
          Account Information
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Typography variant="body2" color="text.secondary">
                Email
              </Typography>
              <Typography fontWeight="medium">{user?.email || 'Not set'}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Typography variant="body2" color="text.secondary">
                Email Verified
              </Typography>
              <Chip
                label={user?.is_email_verified ? 'Verified' : 'Not Verified'}
                color={user?.is_email_verified ? 'success' : 'error'}
                size="small"
              />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Typography variant="body2" color="text.secondary">
                Mobile
              </Typography>
              <Typography fontWeight="medium">{user?.mobile_no || 'Not set'}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Typography variant="body2" color="text.secondary">
                Mobile Verified
              </Typography>
              <Chip
                label={user?.is_mobile_verified ? 'Verified' : 'Not Verified'}
                color={user?.is_mobile_verified ? 'success' : 'error'}
                size="small"
              />
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Change Password */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h6" fontWeight="semibold" gutterBottom>
          Change Password
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="Current Password"
                {...register('current_password', {
                  required: 'Current password is required',
                })}
                error={!!errors.current_password}
                helperText={errors.current_password?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="New Password"
                {...register('new_password', {
                  required: 'New password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                })}
                error={!!errors.new_password}
                helperText={errors.new_password?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="Confirm New Password"
                {...register('confirm_password', {
                  required: 'Please confirm your password',
                  validate: (value) => value === newPassword || 'Passwords do not match',
                })}
                error={!!errors.confirm_password}
                helperText={errors.confirm_password?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" size="large">
                Change Password
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Danger Zone */}
      <Box sx={{ pt: 4, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight="semibold" color="error" gutterBottom>
          Danger Zone
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Once you delete your account, there is no going back. Please be certain.
        </Typography>
        <Button
          variant="outlined"
          color="error"
          size="large"
          onClick={() => setDeleteDialogOpen(true)}
        >
          Delete Account
        </Button>
      </Box>
    </Box>
  );
};

export default Settings;