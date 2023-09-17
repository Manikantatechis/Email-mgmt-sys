import React from 'react';
import { Button, Grid, InputLabel, OutlinedInput, FormHelperText, Container, Paper, Stack, Select, MenuItem } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { addKixieCred } from 'services/credentialsService';

const AddKixieCredentials = ({ setIsKixieCredentialsOpen, role }) => {
  const validationSchema = Yup.object().shape({
    kixieUserId: Yup.string()
      .required('User ID (string) is required')
      .min(1, 'Minimum User ID (string) length is 1 character')
      .max(50, 'Maximum User ID (string) length is 50 characters'),
    name: Yup.string()
      .required('Name is required')
      .min(1, 'Minimum name length is 1 character')
      .max(50, 'Maximum name length is 50 characters'),
    phone: Yup.number()
      .typeError('Phone must be a number')
      .required('Phone number required')
      .min(1e9, 'Minimum phone number length is 10 digits')
      .max(1e10 - 1, 'Maximum phone number length is 10 digits'),
    apiKey: Yup.string()
      .required('API Key is required')
      .min(20, 'Minimum API Key length is 20 characters')
      .max(128, 'Maximum API Key length is 128 characters'),
    businessId: Yup.string()
      .required('Business ID is required')
      .min(1, 'Minimum Business ID length is 1 character')
      .max(50, 'Maximum Business ID length is 50 characters'),
    status: Yup.string().oneOf(['active', 'inactive'], 'Status must be either active or inactive')
  });

  const handleSubmit = async (values) => {
    try {
      const res = await addKixieCred(values);
      if (res) setIsKixieCredentialsOpen(null);
    } catch (err) {
      console.error('Error adding Kixie credentials:', err);
    }
  };

  return (
    <Container
      sx={{
        position: 'fixed',
        height: '100vh',
        width: '100vw',
        top: 0,
        right: 0,
        background: 'rgba(9,9,9,0.57)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Paper elevation={3} sx={{ padding: 4, maxWidth: '500px', width: '90%' }}>
        <Formik
          initialValues={{
            kixieUserId: '',
            name: '',
            phone: '',
            apiKey: '',
            businessId: '',
            type: 'personal',
            status: 'active'
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            handleSubmit(values);
            setSubmitting(false);
          }}
        >
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
            <form noValidate onSubmit={handleSubmit} style={{ width: '90%', margin: '0 auto' }}>
              <Grid container spacing={2}>
                <Container color="primary" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                  Add Kixie Credentials
                </Container>

                <Grid item xs={12}>
                  <InputLabel htmlFor="name">Name</InputLabel>
                  <OutlinedInput
                    sx={{ width: '100%' }}
                    id="name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.name && errors.name)}
                  />
                  <FormHelperText error>{touched.name && errors.name}</FormHelperText>
                </Grid>
                {(role === 'manager' || role === 'director') && (
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="type">Type</InputLabel>
                      <Select labelId="type" id="type" name="type" value={values.type} onChange={handleChange} onBlur={handleBlur}>
                        <MenuItem value="global">Global</MenuItem>
                        <MenuItem value="personal">Personal</MenuItem>
                      </Select>
                    </Stack>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <InputLabel htmlFor="phone">Phone</InputLabel>
                  <OutlinedInput
                    sx={{ width: '100%' }}
                    id="phone"
                    name="phone"
                    value={values.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.phone && errors.phone)}
                  />
                  <FormHelperText error>{touched.phone && errors.phone}</FormHelperText>
                </Grid>
                <Grid item xs={12}>
                  <InputLabel htmlFor="kixieUserId">Kixie User ID</InputLabel>
                  <OutlinedInput
                    sx={{ width: '100%' }}
                    id="kixieUserId"
                    name="kixieUserId"
                    value={values.kixieUserId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.kixieUserId && errors.kixieUserId)}
                  />
                  <FormHelperText error>{touched.kixieUserId && errors.kixieUserId}</FormHelperText>
                </Grid>
                <Grid item xs={12}>
                  <InputLabel htmlFor="apiKey">API Key</InputLabel>
                  <OutlinedInput
                    sx={{ width: '100%' }}
                    id="apiKey"
                    name="apiKey"
                    value={values.apiKey}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.apiKey && errors.apiKey)}
                  />
                  <FormHelperText error>{touched.apiKey && errors.apiKey}</FormHelperText>
                </Grid>
                <Grid item xs={12}>
                  <InputLabel htmlFor="businessId">Business ID</InputLabel>
                  <OutlinedInput
                    sx={{ width: '100%' }}
                    id="businessId"
                    name="businessId"
                    value={values.businessId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.businessId && errors.businessId)}
                  />
                  <FormHelperText error>{touched.businessId && errors.businessId}</FormHelperText>
                </Grid>

                <Grid item xs={12} sx={{ display: 'flex', gap: 1 }}>
                  {' '}
                  <Button disableElevation disabled={isSubmitting} fullWidth type="submit" variant="contained" color="primary">
                    Save{' '}
                  </Button>{' '}
                  <Button fullWidth onClick={() => setIsKixieCredentialsOpen(null)} variant="contained" color="secondary">
                    Cancel{' '}
                  </Button>{' '}
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
};

export default AddKixieCredentials;
