'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Paper,
} from '@mui/material';
import axios from 'axios';

const CompanyForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    companyName: '',
    fileNumber: '',
    natureOfBusiness: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_APP_URL}/company_data`, formData);
      router.push('/dashboard/companies');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 422) {
        setError('Validation failed: ' + JSON.stringify(err.response.data.errors, null, 2));
      } else {
        setError('Failed to save company data.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Button
        onClick={() => router.push('/dashboard/companies')}
        sx={{ mb: 2 }}
      >
        Back to Companies
      </Button>
      <Typography variant="h4" gutterBottom>
        Create Company
      </Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <Paper elevation={3} sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company Name"
                name="companyName"
                value={formData.companyName}
                onChange={handleFormChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="File Number"
                name="fileNumber"
                value={formData.fileNumber}
                onChange={handleFormChange}
                required
              />
            </Grid>

<Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Nature of Business"
                value={formData.natureOfBusiness}
                onChange={handleFormChange}
                name="natureOfBusiness"
                required
              />
            </Grid>

          </Grid>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={20} /> : null}
            >
              {submitting ? 'Saving...' : 'Submit'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default CompanyForm;