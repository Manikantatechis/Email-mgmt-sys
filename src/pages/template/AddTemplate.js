import React, { useState } from 'react';
import { Button, Grid, InputLabel, OutlinedInput, FormHelperText, Stack, Container, Paper, Select, MenuItem } from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { addGmailTemplate, addKixieTemplate } from 'services/templateService';

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
const handleSubmit = async (values) => {
  try {
    // Create a new object based on the condition for the type
    let payload = { ...values };
    if (values.type === 'html') {
      payload.html = payload.content;
      delete payload.content;
    }

    let actionFunction = {
      gmail: addGmailTemplate,
      kixie: addKixieTemplate
    }[actionType];

    if (actionFunction) {
      const res = await actionFunction(payload); // Use payload instead of values
      console.log(res);
      if (res && !res.message) {
        setActionType(null);
      }
    } else {
      console.warn(`Invalid actionType: ${actionType}`);
    }
  } catch (error) {
    console.error(error.message);
  }
};



  return (
    <Container style={{ position: 'fixed', top: '20%', width: '70%', height: '70vh', overflow: 'scroll' }}>
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
              handleSubmit(values);
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
                      <Select
                        variant="outlined"
                        id="status"
                        name="status"
                        value={values.status}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(touched.status && errors.status)}
                      >
                        <MenuItem value={"active"}>Active</MenuItem>
                        <MenuItem value={"inactive"}>In Active</MenuItem>
                      </Select>
                      {errors.status && touched.status && <FormHelperText error>{errors.status}</FormHelperText>}
                    </Stack>
                  </Grid>

                  {actionType === 'gmail' && (
                    <>
                      <Container color="primary" sx={{ position: 'absolute', textAlign: 'center', fontWeight: 'bold' }}>
                        Add Gmail Template
                      </Container>
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
                      <Container color="primary" sx={{ position: 'absolute', textAlign: 'center', fontWeight: 'bold' }}>
                        Add Kixie Template
                      </Container>
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
