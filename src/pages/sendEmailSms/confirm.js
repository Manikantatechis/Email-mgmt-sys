import React, { useEffect, useState } from 'react';
import { TextField, Grid, InputLabel, FormControl, Button, Stack, Select, MenuItem, Container, CircularProgress, } from '@mui/material';
import { getGmailTemplatesNames, getKixieTemplatesNames } from 'services/templateService';
import { getGmailCredNames, getKixieCredNames } from 'services/credentialsService';
import { sendMessage } from 'services/messageService';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// or if you are using a different date library
// import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';


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
            options &&
            options.length > 0 &&
            options?.map(({ _id, name, subject, email }) => (
              <MenuItem value={_id} key={_id}>
                {name || subject || email}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>
    </Stack>
  </Grid>
);

const Confirm = ({ actionType, setActionType, tableData, setResData, loadingSend, setIsSendLoading }) => {
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

  // State for the DateTimePicker
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());

  // Handler for the DateTimePicker change
  const handleDateTimeChange = (newValue) => {
    setSelectedDateTime(newValue);
  };

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
    setIsSendLoading(true);

    if (actionType === SMS || actionType === BOTH) {
      actionData.kixieCredId = kixieNo;
      actionData.kixieTemplateId = kixieTemplate;
    }

    if (actionType === EMAIL || actionType === BOTH) {
      actionData.emailCredId = mailId;
      actionData.emailTemplateId = emailTemplate;
    }
    try {
      const res = await sendMessage({ actionData, tableData, actionType });

      setResData(res);
      setIsSendLoading(false);
    } catch (error) {
      console.log(error);
    }

    // Clear the selected values if needed
    setKixieTemplate('');
    setEmailTemplate('');
    setMailId('');
    setKixieNo('');
    setActionType(false);
    setIsSendLoading(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
    <Container
      style={{
        width: '100vw',
        position: 'fixed',
        height: '100vh',
        top: '0',
        right: '0',
        background: '#09090957',
        overflow: 'hidden'
      }}
      maxWidth={false}
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
    <Stack spacing={1}>
      <InputLabel >Select Date and Time</InputLabel>

      
        <DateTimePicker
          // label="Select Date and Time"
          value={selectedDateTime}
          onChange={handleDateTimeChange}
          renderInput={(params) => <TextField {...params} />}
        />

    </Stack>
  </Grid>
        <Grid item xs={12} sx={{display:"flex", gap:"10px"}}>
          
            <Button sx={{flex: 1, }}variant="contained" color="primary" onClick={handleSend} fullWidth disabled={loadingSend}>
            {loadingSend ? <CircularProgress size={24} color="inherit" /> : 'Send'}
          </Button>
          
          
          
         
          <Button sx={{flex: 1}}variant="contained"  onClick={handleCancel} fullWidth style={{flex: 1, background:"rgb(76, 175, 80)"}}>
            Schedule
          </Button>
          

          <Button sx={{flex: 1}}variant="contained"  onClick={handleCancel} fullWidth style={{ height:"fit-content", background:"rgb(243, 69, 69)"}}>
            Cancel
          </Button>
        </Grid>
        
      </Grid>
    </Container>
    </LocalizationProvider>
  );
};

export default Confirm;
