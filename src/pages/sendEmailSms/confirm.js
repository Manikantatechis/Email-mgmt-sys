import React, { useState } from 'react';
import { Grid, InputLabel, FormControl, Button, Stack, Select, MenuItem } from '@mui/material';
import { Container } from '../../../node_modules/@mui/material/index';

const Confirm = ({ actionType, setActionType }) => {
  const [kixieTemplate, setKixieTemplate] = useState('');
  const [emailTemplate, setEmailTemplate] = useState('');
  const [mailId, setMailId] = useState('');
  const [kixieNo, setKixieNo] = useState('');

  const handleSend = () => {
    // Handle the sending logic here
  };

  const handleCancel = () => {
    // Handle the cancel logic here

    setKixieTemplate('');
    setEmailTemplate;
    ('');
    setMailId('');
    setKixieNo('');
    setActionType(false);
  };

  return (
    <Container
      style={{
        width: '500vh',
        position: 'fixed',
        height: '100vh',
        top: '0',
        right: '0',
        background: '#09090957',
        overflow: 'hidden'
      }}
    >
      <Grid
        container
        spacing={3}
        style={{
          transform: 'translate(-50%, -50%)',
          position: 'fixed',
          top: '50%',
          left: '50%',
          maxWidth: '400px',
          background: 'white',
          paddingRight: '24px',
          paddingBottom: '24px'
        }}
      >
        {actionType === 'sms' || actionType === 'both' ? (
          <>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="kixie-template">Kixie Template</InputLabel>
                <FormControl variant="outlined" fullWidth>
                  <Select
                    labelId="kixie-template-label"
                    id="kixie-template"
                    value={kixieTemplate}
                    onChange={(e) => setKixieTemplate(e.target.value)}
                    fullWidth
                  >
                    <MenuItem value="template1">Template 1</MenuItem>
                    <MenuItem value="template2">Template 2</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="kixie-no">Kixie No</InputLabel>
                <FormControl variant="outlined" fullWidth>
                  <Select labelId="kixie-no-label" id="kixie-no" value={kixieNo} onChange={(e) => setKixieNo(e.target.value)} fullWidth>
                    <MenuItem value="no1">Alex Kennedy</MenuItem>
                    <MenuItem value="no2">Cameron Riley</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Grid>
          </>
        ) : null}

        {actionType === 'email' || actionType === 'both' ? (
          <>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="email-template">Email Template</InputLabel>
                <FormControl variant="outlined" fullWidth>
                  <Select
                    labelId="email-template-label"
                    id="email-template"
                    value={emailTemplate}
                    onChange={(e) => setEmailTemplate(e.target.value)}
                    fullWidth
                  >
                    <MenuItem value="emailTemplate1">Payment Due</MenuItem>
                    <MenuItem value="emailTemplate2">Ko - HTML[Interview]</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="mail-id">Mail ID</InputLabel>
                <FormControl variant="outlined" fullWidth>
                  <Select labelId="mail-id-label" id="mail-id" value={mailId} onChange={(e) => setMailId(e.target.value)} fullWidth>
                    <MenuItem value="support@techis.io">support@techis.io</MenuItem>
                    <MenuItem value="manikanta@techis.io">manikanta@techis.io</MenuItem>
                    <MenuItem value="project1@techis.io">project1@techis.io</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Grid>
          </>
        ) : null}

        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSend} fullWidth>
            Send
          </Button>
          <Button variant="contained" color="secondary" onClick={handleCancel} fullWidth style={{ marginTop: '10px' }}>
            Cancel
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Confirm;
