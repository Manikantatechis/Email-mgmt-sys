import React, { useState } from 'react';
import { Button, Grid, InputLabel, OutlinedInput, FormHelperText, Stack, Container, Paper, Select, MenuItem } from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';

const AddTemplate = ({ actionType, setActionType }) => {
  const [preview, setPreview] = useState('');

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    status: Yup.string().required('Status is required'),
    type: Yup.string().when('actionType', {
      is: 'gmail',
      then: Yup.string().required('Type is required')
    }),
    content: Yup.string().required('Content is required')
  });

  return (
    <Container style={{ position: 'fixed', top: '20%', width: '70%', height:"70vh", overflow:"scroll"}}>
      <Paper elevation={3} style={{ padding: '30px' }}>
        {actionType && (
          <Formik
            initialValues={{
              name: '',
              status: 'Active',
              type: 'text',
              content: ''
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              console.log('Submitting values', values);
              setSubmitting(false);
            }}
          >
            {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
              <form noValidate onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="name">Name</InputLabel>
                      <OutlinedInput
                        id="name"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(touched.name && errors.name)}
                      />
                      {errors.name && touched.name && <FormHelperText error>{errors.name}</FormHelperText>}
                    </Stack>
                  </Grid>

                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="status">Status</InputLabel>
                      <OutlinedInput
                        id="status"
                        name="status"
                        value={values.status}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(touched.status && errors.status)}
                      />
                      {errors.status && touched.status && <FormHelperText error>{errors.status}</FormHelperText>}
                    </Stack>
                  </Grid>

                  {actionType === 'gmail' && (
                    <>
                      <Grid item xs={12}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="type">Type</InputLabel>
                          <Select labelId="type" id="type" name="type" value={values.type} onChange={handleChange} onBlur={handleBlur}>
                            <MenuItem value="text">Text</MenuItem>
                            <MenuItem value="html">HTML</MenuItem>
                          </Select>
                        </Stack>
                      </Grid>

                      <Grid item xs={12}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="content">Content</InputLabel>
                          <OutlinedInput
                            id="content"
                            name="content"
                            value={values.content}
                            onChange={(e) => {
                              handleChange(e);
                              if (values.type === 'html') {
                                setPreview(e.target.value);
                              }
                            }}
                            onBlur={handleBlur}
                            error={Boolean(touched.content && errors.content)}
                            multiline
                          />
                          {errors.content && touched.content && <FormHelperText error>{errors.content}</FormHelperText>}
                          {values.type === 'html' && preview && <div dangerouslySetInnerHTML={{ __html: preview }} />}
                        </Stack>
                      </Grid>
                    </>
                  )}

                  {actionType === 'kixie' && (
                    <>
                      <Grid item xs={12}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="content">Content</InputLabel>
                          <OutlinedInput
                            id="content"
                            name="content"
                            value={values.content}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={Boolean(touched.content && errors.content)}
                            multiline
                          />
                          {errors.content && touched.content && <FormHelperText error>{errors.content}</FormHelperText>}
                        </Stack>
                      </Grid>
                    </>
                  )}

                  <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary">
                      Save
                    </Button>
                    <Button onClick={() => setActionType(null)} variant="contained" color="secondary">
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

export default AddTemplate;
