import { addGmailTemplate, editGmailTemplate } from 'services/templateService';
import { useDispatch } from 'react-redux';

import React, { useEffect, useState } from 'react';
import {
  Button,
  Grid,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  Stack,
  Container,
  Paper,
  Select,
  MenuItem,
  TextField
} from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { handleRequest } from 'services/Api';
import { addTemplate, editTemplate } from 'store/templates/templateSlice';

const AddGmailTemplate = ({ setIsGmailTemplateOpen, role, actionType }) => {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [preview, setPreview] = useState('');
  const { id, type } = actionType || {};
  const [initialState, setInitialState] = useState({
    subject: '',
    status: 'Active',
    type: 'text',
    template_type: 'personal',
    content: '',
    cc: [],
    bcc: []
  });

  const dispatch = useDispatch()

  const getGmailTemplateById = async () => {
    try {
      const res = await handleRequest('get', `/api/gmail-template/list/${id}`);
      if (res) {
        setInitialState({...res, content:res.html ? res.html : res.content });
        // console.log(res);
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
      getGmailTemplateById();
    } else {
      setDataLoaded(true);
    }
  }, []);

  const validationSchema = Yup.object().shape({
    subject: Yup.string().required('Subject is required'),
    status: Yup.string().required('Status is required'),
    type: Yup.string().when('actionType', {
      is: 'gmail',
      then: Yup.string().required('Type is required')
    }),
    content: Yup.string().required('Content is required')
  });

  const handleSubmit = async (values) => {
    try {
      const payload = { ...values };

      if (values.type === 'html') {
        payload.html = payload.content;
        delete payload.content;
      }
      payload.cc = values.cc;
      payload.bcc = values.bcc;
      let res = null
      if (id && type === 'edit') {
        res = await editGmailTemplate(payload, id);
        
        if(res && !res.message){
          dispatch(editTemplate({type:"gmail", template:res}))
        }

      } else {
        res = await addGmailTemplate(payload);

        if(res && !res.message){
          dispatch(addTemplate({type:"gmail", template:res}))
        }

      }

      
      if (res && !res.message) {
        setIsGmailTemplateOpen(null);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleCcKeyDown = (e, setFieldValue, values) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const email = e.target.value.trim();
      if (email) {
        const newCc = [...values.cc, email];
        setFieldValue('cc', newCc); // Update the 'cc' field in values
        e.target.value = ''; // Reset the input value to an empty string
      }
    }
  };

  const handleBccKeyDown = (e, setFieldValue, values) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const email = e.target.value.trim();
      if (email) {
        const newBcc = [...values.bcc, email];
        setFieldValue('bcc', newBcc); // Update the 'bcc' field in values
        e.target.value = ''; // Reset the input value to an empty string
      }
    }
  };

  return (
    <Container style={{ position: 'fixed', top: '20%', width: '70%', height: '70vh', overflowY: 'scroll', overflowX: 'hidden' }}>
      <Paper elevation={3} style={{ padding: '30px' }}>
        {dataLoaded && (
          <Formik
            initialValues={initialState}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting, setFieldValue }) => {
              handleSubmit(values, setFieldValue);
              setSubmitting(false);
            }}
          >
            {({ errors, handleBlur, handleChange, handleSubmit, touched, values, setFieldValue }) => (
              <form noValidate onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="subject">Subject</InputLabel>
                      <OutlinedInput
                        id="subject"
                        name="subject"
                        value={values.subject}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={Boolean(touched.subject && errors.subject)}
                      />
                      {errors.subject && touched.subject && <FormHelperText error>{errors.subject}</FormHelperText>}
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
                    <Stack spacing={1}sx={{maxHeight:"40vh", overflowY:"scroll"}}>
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
                      
                    </Stack><br />{values.type === 'html' && preview && <div dangerouslySetInnerHTML={{ __html: preview }} />}
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="cc">CC</InputLabel>
                      <TextField
                        id="cc"
                        name="cc"
                        onBlur={handleBlur}
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={3}
                        onKeyDown={(e) => handleCcKeyDown(e, setFieldValue, values)}
                        placeholder="Add email addresses separated by commas or press Enter"
                        className="cc-input"
                      />
                      {values.cc.map((email, index) => (
                        <span key={index} className="email-tag">
                          {email}
                        </span>
                      ))}
                    </Stack>
                  </Grid>

                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="bcc">BCC</InputLabel>
                      <TextField
                        id="bcc"
                        name="bcc"
                        onBlur={handleBlur}
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={3}
                        onKeyDown={(e) => handleBccKeyDown(e, setFieldValue, values)}
                        placeholder="Add email addresses separated by commas or press Enter"
                        className="bcc-input"
                      />
                      {values.bcc.map((email, index) => (
                        <span key={index} className="email-tag">
                          {email}
                        </span>
                      ))}
                    </Stack>
                  </Grid>

                  <Grid item xs={12} sx={{ display: 'flex', gap: '10px' }}>
                    <Button type="submit" variant="contained" color="primary">
                      Save
                    </Button>
                    <Button onClick={() => setIsGmailTemplateOpen(null)} variant="contained" color="secondary">
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

export default AddGmailTemplate;
