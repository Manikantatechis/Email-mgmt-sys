import { addKixieTemplate, editKixieTemplate } from 'services/templateService';

import { Button, Grid, InputLabel, OutlinedInput, FormHelperText, Stack, Container, Paper, Select, MenuItem } from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import { handleRequest } from 'services/Api';

const AddKixieTempate = ({ setIsKixieTemplateOpen, role, actionType }) => {
  const [dataLoaded, setDataLoaded] = useState(false);
  const { id, type } = actionType || {};

  const [initialState, setInitialState] = useState({
    name: '',
    status: 'active',
    template_type: 'personal',
    content: ''
  });

  const getKixieTemplateById = async () => {
    try {
      const res = await handleRequest('get', `/api/kixie-template/list/${id}`);
      if (res) {
        setInitialState({ ...res, content: res.html ? res.html : res.content });
        console.log(res);
        setDataLoaded(true);
        if (res.type === 'html') {
          setPreview(res.html);
        }
      }
    } catch (error) {
      setDataLoaded(true);
      console.log(error);
    }
  };

  useEffect(() => {
    if (id && type === 'edit') {
      getKixieTemplateById();
    } else {
      setDataLoaded(true);
    }
  }, []);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    status: Yup.string().required('Status is required'),
    content: Yup.string().required('Content is required')
  });

  const handleSubmit = async (values) => {
    try {
      let res = null
      if (id && type === 'edit') {
        res = await editKixieTemplate({ ...values }, id);


      } else {
        res = await addKixieTemplate({ ...values });

      }
      if (res && !res.message) {
        setIsKixieTemplateOpen(null);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Container style={{ position: 'fixed', top: '20%', width: '70%', height: '70vh', overflowY: 'scroll', overflowX: 'hidden' }}>
      <Paper elevation={3} style={{ padding: '30px' }}>
        {dataLoaded && (
          <Formik
            initialValues={initialState}
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
                        <MenuItem value={'active'}>Active</MenuItem>
                        <MenuItem value={'inactive'}>In Active</MenuItem>
                      </Select>
                      {errors.status && touched.status && <FormHelperText error>{errors.status}</FormHelperText>}
                    </Stack>
                  </Grid>
                  {(role === 'manager' || role === 'director') && (
                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="type">Template Type</InputLabel>
                        <Select
                          labelId="type"
                          id="type"
                          name="template_type"
                          value={values.template_type}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        >
                          <MenuItem value="global">Global</MenuItem>
                          <MenuItem value="personal">Personal</MenuItem>
                        </Select>
                      </Stack>
                    </Grid>
                  )}

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

                  <Grid item xs={12} sx={{ display: 'flex', gap: '10px' }}>
                    <Button type="submit" variant="contained" color="primary">
                      Save
                    </Button>
                    <Button onClick={() => setIsKixieTemplateOpen(null)} variant="contained" color="secondary">
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

export default AddKixieTempate;
