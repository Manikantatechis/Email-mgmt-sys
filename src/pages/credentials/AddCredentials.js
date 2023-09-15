import React from 'react';
import { Button, Grid, InputLabel, OutlinedInput, FormHelperText, Container, Paper } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { addGmailCred, addKixieCred } from 'services/credentialsService';

const AddCredentials = ({ actionType, setActionType }) => {
  const kixieValidationSchema = Yup.object().shape({
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

  const gmailValidationSchema = Yup.object().shape({
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

  const validationSchema = actionType === 'kixie' ? kixieValidationSchema : gmailValidationSchema;

const handleSubmit = async (values) => {
  switch (actionType) {
    case 'gmail':
      try {
        const res = await addGmailCred(values);
        if (res) setActionType(null);
      } catch (err) {
        console.error('Error adding Gmail credentials:', err);
      }
      break;

    case 'kixie':
      try {
        const res = await addKixieCred(values);
        if (res) setActionType(null);
      } catch (err) {
        console.error('Error adding Kixie credentials:', err);
      }
      break;

    default:
      console.warn('Unknown action type:', actionType);
      break;
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
            email: '',
            oauthClientId: '',
            oauthClientSecret: '',
            oauthRefreshToken: '',
            kixieUserId: '',
            name: '',
            phone: '',
            apiKey: '',
            businessId: ''
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
                {actionType === 'gmail' && (
                  <>
                    <Container color="primary" sx={{ textAlign: 'center', fontWeight:"bold" }}>
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
                  </>
                )}

                {actionType === 'kixie' && (
                  <>
                  
                    <Container color="primary" sx={{ textAlign: 'center', fontWeight:"bold" }}>
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
                  </>
                )}

                <Grid item xs={12} sx={{ display: 'flex', gap: 1 }}>
                  {' '}
                  <Button disableElevation disabled={isSubmitting} fullWidth type="submit" variant="contained" color="primary">
                    Save{' '}
                  </Button>{' '}
                  <Button fullWidth onClick={() => setActionType(null)} variant="contained" color="secondary">
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

export default AddCredentials;
