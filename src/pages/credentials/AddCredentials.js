



import React from 'react';
import { Button, Grid, InputLabel, OutlinedInput, FormHelperText, Stack, Container, Paper } from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';

const AddCredentials = ({ actionType, setActionType }) => {

  const validationSchema = Yup.object().shape({
    apiKey: Yup.string().required('API Key is required'),
    businessId: Yup.string().required('Business ID is required'),
    userId: Yup.string().required('User ID is required'),
    email: Yup.string().email('Must be a valid email').required('Email is required'),
    oauthClientId: Yup.string().required('OAuth Client ID is required'),
    oauthClientSecret: Yup.string().required('OAuth Client Secret is required'),
    oauthRefreshToken: Yup.string().required('OAuth Refresh Token is required')
  });

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
        {actionType && (
          <Formik
            initialValues={{
              apiKey: '',
              businessId: '',
              userId: '',
              email: '',
              oauthClientId: '',
              oauthClientSecret: '',
              oauthRefreshToken: ''
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              try {
                console.log('Submitting values', values);
                setSubmitting(false);
              } catch (error) {
                console.error(error);
                setSubmitting(false);
              }
            }}
          >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
              <form noValidate onSubmit={handleSubmit} style={{width:"90%", margin:"0 auto"}}>
                <Grid container spacing={3}>
                  <Grid container spacing={3}>
                    {actionType === 'kixie' && (
                      <>
                        <Grid item xs={12}>
                          <Stack spacing={1}>
                            <InputLabel htmlFor="email">Kixie</InputLabel>
                          </Stack>
                        </Grid> <br />
                        <Grid item xs={12}>
                          <Stack spacing={1}>
                            <InputLabel htmlFor="api-key">API Key</InputLabel>
                            <OutlinedInput
                              id="api-key"
                              name="apiKey"
                              value={values.apiKey}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={Boolean(touched.apiKey && errors.apiKey)}
                            />
                            {errors.apiKey && touched.apiKey && <FormHelperText error>{errors.apiKey}</FormHelperText>}
                          </Stack>
                        </Grid>
                        <Grid item xs={12}>
                          <Stack spacing={1}>
                            <InputLabel htmlFor="business-id">Business ID</InputLabel>
                            <OutlinedInput
                              id="business-id"
                              name="businessId"
                              value={values.businessId}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={Boolean(touched.businessId && errors.businessId)}
                            />
                            {errors.businessId && touched.businessId && <FormHelperText error>{errors.businessId}</FormHelperText>}
                          </Stack>
                        </Grid>
                        <Grid item xs={12}>
                          <Stack spacing={1}>
                            <InputLabel htmlFor="user-id">User ID</InputLabel>
                            <OutlinedInput
                              id="user-id"
                              name="userId"
                              value={values.userId}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={Boolean(touched.userId && errors.userId)}
                            />
                            {errors.userId && touched.userId && <FormHelperText error>{errors.userId}</FormHelperText>}
                          </Stack>
                        </Grid>
                      </>
                    )}

                    {actionType === 'gmail' && (
                      <>
                        <Grid item xs={12}>
                          <Stack spacing={1}>
                            <InputLabel htmlFor="email">Gmail</InputLabel>
                          </Stack>
                        </Grid>{' '}
                        <br />
                        <Grid item xs={12}>
                          <Stack spacing={1}>
                            <InputLabel htmlFor="email">Email</InputLabel>
                            <OutlinedInput
                              id="email"
                              name="email"
                              value={values.email}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={Boolean(touched.email && errors.email)}
                            />
                            {errors.email && touched.email && <FormHelperText error>{errors.email}</FormHelperText>}
                          </Stack>
                        </Grid>
                        <Grid item xs={12}>
                          <Stack spacing={1}>
                            <InputLabel htmlFor="oauth-client-id">OAuth Client ID</InputLabel>
                            <OutlinedInput
                              id="oauth-client-id"
                              name="oauthClientId"
                              value={values.oauthClientId}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={Boolean(touched.oauthClientId && errors.oauthClientId)}
                            />
                            {errors.oauthClientId && touched.oauthClientId && <FormHelperText error>{errors.oauthClientId}</FormHelperText>}
                          </Stack>
                        </Grid>
                        <Grid item xs={12}>
                          <Stack spacing={1}>
                            <InputLabel htmlFor="oauth-client-secret">OAuth Client Secret</InputLabel>
                            <OutlinedInput
                              id="oauth-client-secret"
                              name="oauthClientSecret"
                              value={values.oauthClientSecret}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={Boolean(touched.oauthClientSecret && errors.oauthClientSecret)}
                            />
                            {errors.oauthClientSecret && touched.oauthClientSecret && (
                              <FormHelperText error>{errors.oauthClientSecret}</FormHelperText>
                            )}
                          </Stack>
                        </Grid>
                        <Grid item xs={12}>
                          <Stack spacing={1}>
                            <InputLabel htmlFor="oauth-refresh-token">OAuth Refresh Token</InputLabel>
                            <OutlinedInput
                              id="oauth-refresh-token"
                              name="oauthRefreshToken"
                              value={values.oauthRefreshToken}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={Boolean(touched.oauthRefreshToken && errors.oauthRefreshToken)}
                            />
                            {errors.oauthRefreshToken && touched.oauthRefreshToken && (
                              <FormHelperText error>{errors.oauthRefreshToken}</FormHelperText>
                            )}
                          </Stack>
                        </Grid>
                      </>
                    )}
                  </Grid>

                  <Grid item xs={12} sx={{ display: 'flex', gap: 1 }}>
                    <Button disabled={isSubmitting} fullWidth type="submit" variant="contained" color="primary">
                      Save
                    </Button>
                    <Button fullWidth onClick={() => setActionType(null)} variant="contained" color="secondary">
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </form>
            )}
          </Formik>
        )}
      </Paper>
    </Container>
  );
};

export default AddCredentials;

