import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useMutation, useQuery } from '@tanstack/react-query';
import { companyApi } from '../api/companyApi';
import {
  Box,
  Container,
  Paper,
  Button,
  TextField,
  Typography,
  Grid,
  CircularProgress,
  MenuItem,
  Avatar,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Upload,
  Check,
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { setCompany } from '../store/slices/companySlice';
import { fileToBase64 } from '../config/cloudinary';
import SidebarLayout from '../components/SidebarLayout';

const CompanyRegistration = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      company_name: '',
      address: '',
      city: '',
      state: '',
      country: '',
      postal_code: '',
      website: '',
      industry: '',
      founded_date: '',
      description: '',
    },
  });

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
      setValue('company_name', company.company_name || '');
      setValue('address', company.address || '');
      setValue('city', company.city || '');
      setValue('state', company.state || '');
      setValue('country', company.country || '');
      setValue('postal_code', company.postal_code || '');
      setValue('website', company.website || '');
      setValue('industry', company.industry || '');
      setValue('founded_date', company.founded_date || '');
      setValue('description', company.description || '');

      if (company.logo_url) setLogoPreview(company.logo_url);
      if (company.banner_url) setBannerPreview(company.banner_url);
    }
  }, [companyData, setValue]);

  const steps = [
    { number: 1, title: 'Basic Info' },
    { number: 2, title: 'Location' },
    { number: 3, title: 'Details' },
    { number: 4, title: 'Media' },
  ];

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const response = await companyApi.createCompany(data);
      // Upload images if they exist
      if (logoFile) {
        const logoBase64 = await fileToBase64(logoFile);
        await companyApi.uploadLogo(logoBase64);
      }
      if (bannerFile) {
        const bannerBase64 = await fileToBase64(bannerFile);
        await companyApi.uploadBanner(bannerBase64);
      }
      return response;
    },
    onSuccess: (response) => {
      dispatch(setCompany(response.data.company));
      toast.success('Company profile created successfully!');
      navigate('/dashboard');
    },
    onError: (error) => {
      console.error('Create company error:', error);
      toast.error(error.response?.data?.message || 'Failed to create company profile');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const response = await companyApi.updateCompany(data);
      // Upload images if they exist
      if (logoFile) {
        const logoBase64 = await fileToBase64(logoFile);
        await companyApi.uploadLogo(logoBase64);
      }
      if (bannerFile) {
        const bannerBase64 = await fileToBase64(bannerFile);
        await companyApi.uploadBanner(bannerBase64);
      }
      return response;
    },
    onSuccess: (response) => {
      dispatch(setCompany(response.data.company));
      toast.success('Company profile updated successfully!');
      navigate('/dashboard');
    },
    onError: (error) => {
      console.error('Update company error:', error);
      toast.error(error.response?.data?.message || 'Failed to update company profile');
    },
  });

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Logo file size must be less than 5MB');
        return;
      }
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Banner file size must be less than 10MB');
        return;
      }
      setBannerFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setBannerPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const nextStep = async () => {
    let fieldsToValidate = [];

    switch (currentStep) {
      case 1:
        fieldsToValidate = ['company_name', 'industry'];
        break;
      case 2:
        fieldsToValidate = ['address', 'city', 'state', 'country', 'postal_code'];
        break;
      case 3:
        fieldsToValidate = [];
        break;
      case 4:
        // Don't auto-submit, just stay on step 4
        return;
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data) => {
    try {
      // Prepare company data according to backend schema
      const companyData = {
        company_name: data.company_name.trim(),
        address: data.address.trim(),
        city: data.city.trim(),
        state: data.state.trim(),
        country: data.country.trim(),
        postal_code: data.postal_code.trim(),
        industry: data.industry,
        // Optional fields - only include if they have values
        ...(data.website && { website: data.website.trim() }),
        ...(data.founded_date && { founded_date: data.founded_date }),
        ...(data.description && { description: data.description.trim() }),
      };

      console.log('Submitting company data:', companyData);

      if (isEdit) {
        await updateMutation.mutateAsync(companyData);
      } else {
        await createMutation.mutateAsync(companyData);
      }
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <SidebarLayout>
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {isEdit ? 'Edit Company Profile' : 'Company Registration'}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            Complete your company profile in a few simple steps
          </Typography>

          {/* Progress Steps */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 6 }}>
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'medium',
                      transition: 'all 0.3s',
                      bgcolor:
                        currentStep >= step.number ? 'primary.main' : 'grey.300',
                      color: currentStep >= step.number ? 'white' : 'text.secondary',
                    }}
                  >
                    {currentStep > step.number ? <Check /> : step.number}
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                    {step.title}
                  </Typography>
                </Box>
                {index < steps.length - 1 && (
                  <Box
                    sx={{
                      flex: 1,
                      height: 4,
                      mx: 2,
                      borderRadius: 1,
                      bgcolor: currentStep > step.number ? 'primary.main' : 'grey.300',
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <Box sx={{ minHeight: 300 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Company Name *"
                      placeholder="Enter company name"
                      {...register('company_name', {
                        required: 'Company name is required',
                        minLength: {
                          value: 2,
                          message: 'Company name must be at least 2 characters',
                        },
                      })}
                      error={!!errors.company_name}
                      helperText={errors.company_name?.message}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      select
                      label="Industry *"
                      {...register('industry', { required: 'Industry is required' })}
                      error={!!errors.industry}
                      helperText={errors.industry?.message}
                    >
                      <MenuItem value="">Select industry</MenuItem>
                      <MenuItem value="Technology">Technology</MenuItem>
                      <MenuItem value="Finance">Finance</MenuItem>
                      <MenuItem value="Healthcare">Healthcare</MenuItem>
                      <MenuItem value="Education">Education</MenuItem>
                      <MenuItem value="Retail">Retail</MenuItem>
                      <MenuItem value="Manufacturing">Manufacturing</MenuItem>
                      <MenuItem value="Real Estate">Real Estate</MenuItem>
                      <MenuItem value="Consulting">Consulting</MenuItem>
                      <MenuItem value="Marketing">Marketing</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Website"
                      type="url"
                      placeholder="https://www.example.com"
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
                </Grid>
              </Box>
            )}

            {/* Step 2: Location */}
            {currentStep === 2 && (
              <Box sx={{ minHeight: 300 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address *"
                      placeholder="Enter street address"
                      {...register('address', { required: 'Address is required' })}
                      error={!!errors.address}
                      helperText={errors.address?.message}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="City *"
                      placeholder="City"
                      {...register('city', { required: 'City is required' })}
                      error={!!errors.city}
                      helperText={errors.city?.message}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="State *"
                      placeholder="State"
                      {...register('state', { required: 'State is required' })}
                      error={!!errors.state}
                      helperText={errors.state?.message}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Country *"
                      placeholder="Country"
                      {...register('country', { required: 'Country is required' })}
                      error={!!errors.country}
                      helperText={errors.country?.message}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Postal Code *"
                      placeholder="Postal Code"
                      {...register('postal_code', {
                        required: 'Postal code is required',
                      })}
                      error={!!errors.postal_code}
                      helperText={errors.postal_code?.message}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Step 3: Details */}
            {currentStep === 3 && (
              <Box sx={{ minHeight: 300 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
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
              </Box>
            )}

            {/* Step 4: Media */}
            {currentStep === 4 && (
              <Box sx={{ minHeight: 300 }}>
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                      Company Logo
                    </Typography>
                    <Paper
                      sx={{
                        border: 2,
                        borderStyle: 'dashed',
                        borderColor: 'divider',
                        p: 3,
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        '&:hover': { borderColor: 'primary.main' },
                      }}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        style={{ display: 'none' }}
                        id="logo-upload"
                      />
                      <label htmlFor="logo-upload" style={{ cursor: 'pointer' }}>
                        {logoPreview ? (
                          <Avatar
                            src={logoPreview}
                            alt="Logo preview"
                            sx={{
                              width: 120,
                              height: 120,
                              margin: '0 auto',
                            }}
                          />
                        ) : (
                          <>
                            <Upload sx={{ fontSize: 48, color: 'text.secondary' }} />
                            <Typography color="text.secondary" sx={{ mt: 1 }}>
                              Click to upload logo (Max 5MB)
                            </Typography>
                          </>
                        )}
                      </label>
                    </Paper>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                      Company Banner
                    </Typography>
                    <Paper
                      sx={{
                        border: 2,
                        borderStyle: 'dashed',
                        borderColor: 'divider',
                        p: 3,
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        '&:hover': { borderColor: 'primary.main' },
                      }}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBannerChange}
                        style={{ display: 'none' }}
                        id="banner-upload"
                      />
                      <label htmlFor="banner-upload" style={{ cursor: 'pointer' }}>
                        {bannerPreview ? (
                          <img
                            src={bannerPreview}
                            alt="Banner preview"
                            style={{
                              width: '100%',
                              height: 150,
                              objectFit: 'cover',
                              borderRadius: 8,
                            }}
                          />
                        ) : (
                          <>
                            <Upload sx={{ fontSize: 48, color: 'text.secondary' }} />
                            <Typography color="text.secondary" sx={{ mt: 1 }}>
                              Click to upload banner (Max 10MB)
                            </Typography>
                          </>
                        )}
                      </label>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Navigation Buttons */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mt: 4,
                pt: 3,
                borderTop: 1,
                borderColor: 'divider',
              }}
            >
              <Button
                onClick={prevStep}
                disabled={currentStep === 1 || isPending}
                startIcon={<ChevronLeft />}
                sx={{ visibility: currentStep === 1 ? 'hidden' : 'visible' }}
              >
                Previous
              </Button>

              {currentStep < 4 ? (
                <Button
                  onClick={nextStep}
                  variant="contained"
                  endIcon={<ChevronRight />}
                  disabled={isPending}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isPending}
                  sx={{ minWidth: 200 }}
                >
                  {isPending ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    `${isEdit ? 'Update' : 'Complete'} Registration`
                  )}
                </Button>
              )}
            </Box>
          </form>
        </Paper>
      </Container>
    </SidebarLayout>
  );
};

export default CompanyRegistration;