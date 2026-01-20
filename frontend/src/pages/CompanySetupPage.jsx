import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
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
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';

import { companyApi } from '../api/companyApi';
import { setCompany } from '../store/slices/companySlice';

const steps = ['Company Info', 'Profile Info', 'Social Links'];

const CompanySetupPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const [socialLinks, setSocialLinks] = useState([{ platform: '', url: '' }]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    trigger,
    getValues,
  } = useForm();

  const companyMutation = useMutation({
    mutationFn: (data) => companyApi.register(data),
    onSuccess: (response) => {
      dispatch(setCompany(response.data.company));
      toast.success('Company registered successfully!');
      navigate('/dashboard');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to register company');
    },
  });

  const handleNext = async () => {
    let fieldsToValidate = [];
    
    if (activeStep === 0) {
      fieldsToValidate = ['company_name', 'address', 'city', 'state', 'country', 'postal_code'];
    } else if (activeStep === 1) {
      fieldsToValidate = ['website', 'industry', 'founded_date', 'description'];
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
    const newLinks = socialLinks.filter((_, i) => i !== index);
    setSocialLinks(newLinks);
  };

  const updateSocialLink = (index, field, value) => {
    const newLinks = [...socialLinks];
    newLinks[index][field] = value;
    setSocialLinks(newLinks);
  };

  const onSubmit = () => {
    const formData = getValues();
    
    const socialLinksObj = {};
    socialLinks.forEach((link) => {
      if (link.platform && link.url) {
        socialLinksObj[link.platform] = link.url;
      }
    });

    const companyData = {
      ...formData,
      social_links: socialLinksObj,
    };

    companyMutation.mutate(companyData);
  };

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
                label="State"
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
                {...register('website', {
                  pattern: {
                    value: /^https?:\/\/.+/,
                    message: 'Please enter a valid URL',
                  },
                })}
                error={!!errors.website}
                helperText={errors.website?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Industry"
                {...register('industry')}
              />
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
                {...register('description')}
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Social Media Links
            </Typography>
            {socialLinks.map((link, index) => (
              <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={5}>
                  <TextField
                    fullWidth
                    label="Platform"
                    value={link.platform}
                    onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                    placeholder="e.g., LinkedIn, Twitter"
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
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
          Company Setup
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ minHeight: 400 }}>
          {renderStepContent(activeStep)}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0 || companyMutation.isPending}
            onClick={handleBack}
          >
            Previous
          </Button>
          <Box>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={companyMutation.isPending}
            >
              {companyMutation.isPending ? (
                <CircularProgress size={24} color="inherit" />
              ) : activeStep === steps.length - 1 ? (
                'Save Profile'
              ) : (
                'Next'
              )}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default CompanySetupPage;