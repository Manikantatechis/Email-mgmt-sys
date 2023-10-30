import React from 'react';
import { Button, Grid, InputLabel, OutlinedInput, FormHelperText, Container, Paper, Stack, Select, MenuItem } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { addGmailCred } from 'services/credentialsService';

const AddGmailCredentials = ({ setIsGmailCredentialsOpen, role }) => {
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required('Email is required')
      .email('Invalid email')
      .min(6, 'Minimum email length is 6 characters')
      .max(128, 'Maximum email length is 128 characters'),
    oauthClientId: Yup.string()
      .required('OAuth Client ID is required')
      .min(5, 'Minimum OAuth Client ID length is 5 characters')
      .max(128, 'Maximum OAuth Client ID length is 128 characters'),
    oauthClientSecret: Yup.string()
      .required('OAuth Client Secret is required')
      .min(8, 'Minimum OAuth Client Secret length is 8 characters')
      .max(128, 'Maximum OAuth Client Secret length is 128 characters'),
    oauthRefreshToken: Yup.string()
      .required('OAuth Refresh Token is required')
      .min(8, 'Minimum OAuth Refresh Token length is 8 characters')
      .max(128, 'Maximum OAuth Refresh Token length is 128 characters'),
    status: Yup.string().oneOf(['active', 'inactive'], 'Status must be either active or inactive')
  });

  const handleSubmit = async (values) => {
    try {
      const res = await addGmailCred(values);
      if (res) setIsGmailCredentialsOpen(null);
    } catch (err) {
      console.error('Error adding Gmail credentials:', err);
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
      maxWidth={false}
      
    >
      <Paper elevation={3} sx={{ padding: 4, maxWidth: '500px', width: '90%' }}>
        <Formik
          initialValues={{
            email: '',
            oauthClientId: '',
            oauthClientSecret: '',
            oauthRefreshToken: '',
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
                  Add Gmail Credentials
                </Container>

                <Grid item xs={12}>
                  <InputLabel htmlFor="email">Email</InputLabel>
                  <OutlinedInput
                    sx={{ width: '100%' }}

                    id="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.email && errors.email)}
                  />
                  <FormHelperText error>{touched.email && errors.email}</FormHelperText>
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
                  <InputLabel htmlFor="oauthClientId">OAuth Client ID</InputLabel>
                  <OutlinedInput
                    sx={{ width: '100%' }}
                    id="oauthClientId"
                    name="oauthClientId"
                    value={values.oauthClientId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.oauthClientId && errors.oauthClientId)}
                  />
                  <FormHelperText error>{touched.oauthClientId && errors.oauthClientId}</FormHelperText>
                </Grid>
                <Grid item xs={12}>
                  <InputLabel htmlFor="oauthClientSecret">OAuth Client Secret</InputLabel>
                  <OutlinedInput
                    sx={{ width: '100%' }}
                    id="oauthClientSecret"
                    name="oauthClientSecret"
                    value={values.oauthClientSecret}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.oauthClientSecret && errors.oauthClientSecret)}
                  />
                  <FormHelperText error>{touched.oauthClientSecret && errors.oauthClientSecret}</FormHelperText>
                </Grid>
                <Grid item xs={12}>
                  <InputLabel htmlFor="oauthRefreshToken">OAuth Refresh Token</InputLabel>
                  <OutlinedInput
                    sx={{ width: '100%' }}
                    id="oauthRefreshToken"
                    name="oauthRefreshToken"
                    value={values.oauthRefreshToken}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.oauthRefreshToken && errors.oauthRefreshToken)}
                  />
                  <FormHelperText error>{touched.oauthRefreshToken && errors.oauthRefreshToken}</FormHelperText>
                </Grid>

                <Grid item xs={12} sx={{ display: 'flex', gap: 1 }}>
                  {' '}
                  <Button disableElevation disabled={isSubmitting} fullWidth type="submit" variant="contained" color="primary">
                    Save{' '}
                  </Button>{' '}
                  <Button fullWidth onClick={() => setIsGmailCredentialsOpen(null)} variant="contained" color="secondary">
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

export default AddGmailCredentials;
