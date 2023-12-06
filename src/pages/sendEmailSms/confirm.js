import React, { useEffect, useState } from 'react';
import {
  TextField,
  Grid,
  InputLabel,
  FormControl,
  Button,
  Stack,
  Select,
  MenuItem,
  Container,
  CircularProgress,
  Typography
} from '@mui/material';
import { getGmailTemplatesNames, getKixieTemplatesNames } from 'services/templateService';
import { getGmailCredNames, getKixieCredNames } from 'services/credentialsService';
import { sendMessage } from 'services/messageService';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import PropTypes from 'prop-types';

const SMS = 'sms';
const EMAIL = 'email';
const BOTH = 'both';

const Dropdown = ({ label, id, value, onChange, options, isLoading, error }) => (
  <Grid item xs={12}>
    <Stack spacing={1}>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <FormControl variant="outlined" fullWidth error={error}>
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

Dropdown.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string,
      subject: PropTypes.string,
      email: PropTypes.string
    })
  ).isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.bool
};

const Confirm = ({ actionType, setActionType, tableData, setResData, loadingSend, setIsSendLoading, handleClear }) => {
  // Confirm component to handle action confirmation
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
  const [selectedDateTime, setSelectedDateTime] = useState();
  const [errors, setErrors] = useState({
    kixieTemplate: false,
    emailTemplate: false,
    mailId: false,
    kixieNo: false,
    schedulingTimeError: false
  });

  const handleDateTimeChange = (newValue) => {
    setSelectedDateTime(newValue);

    const currentTime = new Date();

    // Create a new Date object representing the current time + 10 minutes
    const tenMinutesLater = new Date(currentTime.getTime() + 10 * 60 * 1000);
    if (newValue > tenMinutesLater) {
      setErrors((prev) => ({ ...prev, schedulingTimeError: false }));
    } else {
      setErrors((prev) => ({ ...prev, schedulingTimeError: true }));
    }
  };

  // Fetches data based on actionType
  useEffect(() => {
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
        console.error('Error fetching data:', error);
        // Implement error display to user
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [actionType]);

  const handleCancel = () => {
    setKixieTemplate('');
    setEmailTemplate('');
    setMailId('');
    setKixieNo('');
    setActionType(false);
  };
  const handleError = (isScheduled) => {
    const errorState = {};
    let errorCount = 0;

    if ((actionType === SMS || actionType === BOTH) && !kixieTemplate) {
      errorState.kixieTemplate = true;

      errorCount += 1;
    } else {
      errorState.kixieTemplate = false;
    }

    if ((actionType === SMS || actionType === BOTH) && !kixieNo) {
      errorState.kixieNo = true;

      errorCount += 1;
    } else {
      errorState.kixieNo = false;
    }

    if ((actionType === EMAIL || actionType === BOTH) && !emailTemplate) {
      errorState.emailTemplate = true;

      errorCount += 1;
    } else {
      errorState.emailTemplate = false;
    }

    if ((actionType === EMAIL || actionType === BOTH) && !mailId) {
      errorState.mailId = true;

      errorCount += 1;
    } else {
      errorState.mailId = false;
    }
    const currentTime = new Date();
    const tenMinutesLater = new Date(currentTime.getTime() + 10 * 60 * 1000);

    if (isScheduled && !selectedDateTime) {
      errorState.schedulingTimeError = true;
      errorCount += 1;
    } else if (selectedDateTime > tenMinutesLater) {
      errorState.schedulingTimeError = false;
    } else {
      errorState.schedulingTimeError = true;
      errorCount += 1;
    }

    setErrors(errorState);

    return errorCount === 0;
  };

  const handleSend = async (isScheduled = false) => {
    const hasErrors = !handleError(isScheduled);

    if (hasErrors) {
      // Handle errors, e.g., display an error message
      return;
    }

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
    let options = { actionData, tableData, actionType };
    if (isScheduled) {
      options.scheduledTime = selectedDateTime;
    }

    try {
      const resData = await sendMessage(options);
      setResData(resData);
    } catch (error) {
      setIsSendLoading(false);
      console.log(error);
    } finally {
      setIsSendLoading(false);
      handleClear();
    }

    // Clear the selected values if needed
    setKixieTemplate('');
    setEmailTemplate('');
    setMailId('');
    setKixieNo('');
    setActionType(false);
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
                error={errors.kixieTemplate}
                required={true}
                label="Kixie Template"
                id="kixie-template"
                value={kixieTemplate}
                onChange={(e) => setKixieTemplate(e.target.value)}
                options={names.kixieTN}
                isLoading={loading}
              />
              <Dropdown
                error={errors.kixieNo}
                required={true}
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
                error={errors.emailTemplate}
                required={true}
                label="Email Template"
                id="email-template"
                value={emailTemplate}
                onChange={(e) => setEmailTemplate(e.target.value)}
                options={names.gmailTN}
                isLoading={loading}
              />
              <Dropdown
                error={errors.mailId}
                required={true}
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
              <InputLabel>Select Date and Time</InputLabel>

              <DateTimePicker
                minDate={new Date()}
                maxDate={new Date(new Date().setDate(new Date().getDate() + 7))} // Set maxDate to 7 days from now
                value={selectedDateTime} // This should be a state variable holding the current selected date
                onChange={handleDateTimeChange}
                minutesStep={1}
                renderInput={(params) => <TextField {...params} />}
              />
              {errors.schedulingTimeError && (
                <Typography variant="caption" color="error">
                  Please select a time that is at least 10 minutes greater than the present time.
                </Typography>
              )}
            </Stack>
          </Grid>

          <Grid item xs={12} sx={{ display: 'flex', gap: '10px' }}>
            <Button sx={{ flex: 1 }} variant="contained" color="primary" onClick={() => handleSend(false)} fullWidth disabled={loadingSend}>
              {loadingSend ? <CircularProgress size={24} color="inherit" /> : 'Send'}
            </Button>

            <Button
              sx={{ flex: 1 }}
              variant="contained"
              onClick={() => handleSend(true)}
              fullWidth
              style={{ flex: 1, background: 'rgb(76, 175, 80)' }}
              disabled={loadingSend}
            >
              {loadingSend ? <CircularProgress size={24} color="inherit" /> : 'Schedule'}
            </Button>

            <Button
              sx={{ flex: 1 }}
              variant="contained"
              onClick={handleCancel}
              fullWidth
              style={{ height: 'fit-content', background: 'rgb(243, 69, 69)' }}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </Container>
    </LocalizationProvider>
  );
};

Confirm.propTypes = {
  actionType: PropTypes.oneOf([SMS, EMAIL, BOTH]).isRequired,
  setActionType: PropTypes.func.isRequired,
  tableData: PropTypes.array.isRequired,
  setResData: PropTypes.func.isRequired,
  loadingSend: PropTypes.bool.isRequired,
  setIsSendLoading: PropTypes.func.isRequired,
  handleClear: PropTypes.func.isRequired
};

export default Confirm;
