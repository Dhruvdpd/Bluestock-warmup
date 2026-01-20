import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import {
  Box,
  Container,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Typography,
  Grid,
  CircularProgress,
  IconButton,
  AppBar,
  Toolbar,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useMutation, useQuery } from '@tanstack/react-query';
import { companyApi } from '../api/companyApi';
import { setCompany } from '../store/slices/companySlice';

const steps = ['Basic Information', 'Company Details', 'Social Links'];

const industries = [
  'Technology',
  'Finance',
  'Healthcare',
  'Education',
  'Manufacturing',
  'Retail',
  'Real Estate',
  'Consulting',
  'Marketing',
  'Other',
];

const CompanySetupPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const [socialLinks, setSocialLinks] = useState([{ platform: '', url: '' }]);
  const [isEdit, setIsEdit] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
    setValue,
  } = useForm();

  // Check if editing existing company
  const { data: companyData } = useQuery({
    queryKey: ['company-profile'],
    queryFn: companyApi.getCompany,
    retry: false,
  });

  useEffect(() => {
    if (companyData?.data?.company) {
      const company = companyData.data.company;
      setIsEdit(true);

      // Populate form with existing data
      Object.keys(company).forEach((key) => {
        if (company[key] !== null && key !== 'social_links') {
          setValue(key, company[key]);
        }
      });

      // Populate social links
      if (company.social_links && Object.keys(company.social_links).length > 0) {
        const links = Object.entries(company.social_links).map(([platform, url]) => ({
          platform,
          url,
        }));
        setSocialLinks(links);
      }
    }
  }, [companyData, setValue]);

  const createMutation = useMutation({
    mutationFn: (data) => companyApi.createCompany(data),
    onSuccess: (response) => {
      dispatch(setCompany(response.data.company));
      toast.success('Company profile created successfully!');
      navigate('/dashboard');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create company profile');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => companyApi.updateCompany(data),
    onSuccess: (response) => {
      dispatch(setCompany(response.data.company));
      toast.success('Company profile updated successfully!');
      navigate('/dashboard');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update company profile');
    },
  });

  const handleNext = async () => {
    let fieldsToValidate = [];

    if (activeStep === 0) {
      fieldsToValidate = [
        'company_name',
        'address',
        'city',
        'state',
        'country',
        'postal_code',
      ];
    } else if (activeStep === 1) {
      fieldsToValidate = ['industry'];
    }

    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      if (activeStep === steps.length - 1) {
        onSubmit();
      } else {
        setActiveStep((prev) => prev + 1);
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const addSocialLink = () => {
    setSocialLinks([...socialLinks, { platform: '', url: '' }]);
  };

  const removeSocialLink = (index) => {
    if (socialLinks.length > 1) {
      const newLinks = socialLinks.filter((_, i) => i !== index);
      setSocialLinks(newLinks);
    }
  };

  const updateSocialLink = (index, field, value) => {
    const newLinks = [...socialLinks];
    newLinks[index][field] = value;
    setSocialLinks(newLinks);
  };

  const onSubmit = () => {
    const formData = getValues();

    // Convert social links array to object
    const socialLinksObj = {};
    socialLinks.forEach((link) => {
      if (link.platform && link.url) {
        socialLinksObj[link.platform] = link.url;
      }
    });

    const companyData = {
      company_name: formData.company_name,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      postal_code: formData.postal_code,
      website: formData.website || null,
      industry: formData.industry,
      founded_date: formData.founded_date || null,
      description: formData.description || null,
      social_links: Object.keys(socialLinksObj).length > 0 ? socialLinksObj : null,
    };

    if (isEdit) {
      updateMutation.mutate(companyData);
    } else {
      createMutation.mutate(companyData);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company Name"
                {...register('company_name', {
                  required: 'Company name is required',
                })}
                error={!!errors.company_name}
                helperText={errors.company_name?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                multiline
                rows={3}
                {...register('address', {
                  required: 'Address is required',
                })}
                error={!!errors.address}
                helperText={errors.address?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                {...register('city', {
                  required: 'City is required',
                })}
                error={!!errors.city}
                helperText={errors.city?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="State/Province"
                {...register('state', {
                  required: 'State is required',
                })}
                error={!!errors.state}
                helperText={errors.state?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Country"
                {...register('country', {
                  required: 'Country is required',
                })}
                error={!!errors.country}
                helperText={errors.country?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Postal Code"
                {...register('postal_code', {
                  required: 'Postal code is required',
                })}
                error={!!errors.postal_code}
                helperText={errors.postal_code?.message}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Website"
                type="url"
                placeholder="https://example.com"
                {...register('website', {
                  pattern: {
                    value: /^https?:\/\/.+/,
                    message: 'Please enter a valid URL starting with http:// or https://',
                  },
                })}
                error={!!errors.website}
                helperText={errors.website?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Industry"
                defaultValue=""
                {...register('industry', {
                  required: 'Industry is required',
                })}
                error={!!errors.industry}
                helperText={errors.industry?.message}
              >
                {industries.map((industry) => (
                  <MenuItem key={industry} value={industry}>
                    {industry}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Founded Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                {...register('founded_date')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company Description"
                multiline
                rows={4}
                placeholder="Tell us about your company..."
                {...register('description')}
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Social Media Links (Optional)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Add links to your company's social media profiles
            </Typography>
            {socialLinks.map((link, index) => (
              <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={5}>
                  <TextField
                    fullWidth
                    label="Platform"
                    value={link.platform}
                    onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                    placeholder="e.g., LinkedIn, Twitter, Facebook"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="URL"
                    value={link.url}
                    onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                    placeholder="https://..."
                  />
                </Grid>
                <Grid item xs={12} sm={1}>
                  <IconButton
                    color="error"
                    onClick={() => removeSocialLink(index)}
                    disabled={socialLinks.length === 1}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={addSocialLink}
              variant="outlined"
              sx={{ mt: 2 }}
            >
              Add Social Link
            </Button>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/dashboard')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 2 }}>
            {isEdit ? 'Edit Company Profile' : 'Company Setup'}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 6 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
            {isEdit ? 'Update Your Company Profile' : 'Create Your Company Profile'}
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ minHeight: 400 }}>{renderStepContent(activeStep)}</Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button disabled={activeStep === 0 || isPending} onClick={handleBack}>
              Back
            </Button>
            <Button variant="contained" onClick={handleNext} disabled={isPending}>
              {isPending ? (
                <CircularProgress size={24} color="inherit" />
              ) : activeStep === steps.length - 1 ? (
                isEdit ? 'Update Profile' : 'Save Profile'
              ) : (
                'Next'
              )}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default CompanySetupPage;