
import React, { useEffect, useState } from 'react';
import { Grid, InputLabel, FormControl, Button, Stack, Select, MenuItem, Container, CircularProgress } from '@mui/material';
import { getGmailTemplatesNames, getKixieTemplatesNames } from 'services/templateService';
import { getGmailCredNames, getKixieCredNames } from 'services/credentialsService';
import { sendMessage } from 'services/messageService';

const SMS = 'sms';
const EMAIL = 'email';
const BOTH = 'both';

const Dropdown = ({ label, id, value, onChange, options, isLoading }) => (
  <Grid item xs={12}>
    <Stack spacing={1}>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <FormControl variant="outlined" fullWidth>
        <Select labelId={`${id}-label`} id={id} value={value} onChange={onChange} fullWidth>
          {isLoading ? (
            <MenuItem disabled>
              <CircularProgress size={20} />
            </MenuItem>
          ) : (
            options.map(({ _id, name, email }) => (
              <MenuItem value={_id} key={_id}>
                {name || email}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>
    </Stack>
  </Grid>
);

const Confirm = ({ actionType, setActionType, tableData, setResData }) => {
  const [kixieTemplate, setKixieTemplate] = useState('');
  const [emailTemplate, setEmailTemplate] = useState('');
  const [mailId, setMailId] = useState('');
  const [kixieNo, setKixieNo] = useState('');
  const [names, setNames] = useState({
    kixieTN: [],
    kixieCN: [],
    gmailTN: [],
    gmailCN: []
  });

  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const updatedNames = { ...names };
      if ([BOTH, SMS].includes(actionType)) {
        updatedNames.kixieCN = await getKixieCredNames();
        updatedNames.kixieTN = await getKixieTemplatesNames();
      }

      if ([BOTH, EMAIL].includes(actionType)) {
        updatedNames.gmailCN = await getGmailCredNames();
        updatedNames.gmailTN = await getGmailTemplatesNames();
      }

      setNames(updatedNames);
    } catch (error) {
      // Handle errors here
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [actionType]);

  const handleCancel = () => {
    setKixieTemplate('');
    setEmailTemplate('');
    setMailId('');
    setKixieNo('');
    setActionType(false);
  };

  const handleSend = async () => {
    const actionData = {};

    if (actionType === SMS || actionType === BOTH) {
      actionData.kixieCredId = kixieNo;
      actionData.kixieTemplateId = kixieTemplate;
    }

    if (actionType === EMAIL || actionType === BOTH) {
      actionData.emailCredId = mailId;
      actionData.emailTemplateId = emailTemplate;
    }
    console.log({ actionData, tableData, actionType });
    try {
      const res = await sendMessage({ actionData, tableData, actionType });
      setResData(res)
      console.log(res)
      alert(res)
    } catch (error) {
      console.log(error)
    }

    // Clear the selected values if needed
    setKixieTemplate('');
    setEmailTemplate('');
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
        {actionType === SMS || actionType === BOTH ? (
          <>
            <Dropdown
              label="Kixie Template"
              id="kixie-template"
              value={kixieTemplate}
              onChange={(e) => setKixieTemplate(e.target.value)}
              options={names.kixieTN}
              isLoading={loading}
            />
            <Dropdown
              label="Kixie No"
              id="kixie-no"
              value={kixieNo}
              onChange={(e) => setKixieNo(e.target.value)}
              options={names.kixieCN}
              isLoading={loading}
            />
          </>
        ) : null}
        {actionType === EMAIL || actionType === BOTH ? (
          <>
            <Dropdown
              label="Email Template"
              id="email-template"
              value={emailTemplate}
              onChange={(e) => setEmailTemplate(e.target.value)}
              options={names.gmailTN}
              isLoading={loading}
            />
            <Dropdown
              label="Mail Id"
              id="mail-id"
              value={mailId}
              onChange={(e) => setMailId(e.target.value)}
              options={names.gmailCN}
              isLoading={loading}
            />
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
