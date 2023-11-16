import React, { useState } from 'react';
import {
  TableCell,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert
  //  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import Report from 'pages/sendEmailSms/summaryTable';
import { cancelScheduledTask, getTaskSummary } from 'services/scheduledService';

const ScheduledRow = ({ index, _id, count, created, scheduled, status, type, setScheduledData, userId, user }) => {
  const [showReport, setShowReport] = useState(false);
  const [data, setData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleReport = async () => {
    const report = await getTaskSummary(_id);
    if (report) {
      setData(report.summary);
      console.log(data);
      setShowReport(true);
    }
  };

  const handleClose = () => {
    setData({});
    setShowReport(false);
  };

  const handleCancel = async (id) => {
    setOpenDialog(false);
    const result = await cancelScheduledTask(_id);
    console.log(result);
    if (result) {
      setOpenSnackbar(true);
      setScheduledData((prevData) => {
        const newdata = prevData.data.filter((data) => data._id !== id);
        console.log({ prevData });
        console.log({ newdata });
        return { ...prevData, data: newdata };
      });
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };
  return (
    <>
      <TableRow key={_id}>
        <TableCell
          sx={{
            zIndex: 1,
            textAlign: 'center'
          }}
        >
          {index + 1}
        </TableCell>
        <TableCell
          sx={{
            zIndex: 1,
            textAlign: 'center'
          }}
        >
          {type === 'both' ? 'SMS and Email' : type === 'sms' ? 'SMS' : 'Email'}
        </TableCell>
        <TableCell
          sx={{
            zIndex: 1,
            textAlign: 'center'
          }}
        >
          {count}
        </TableCell>
        <TableCell
          sx={{
            zIndex: 1,
            textAlign: 'center'
          }}
        >
          <FormatDateToIST utcString={created} />
        </TableCell>
        <TableCell
          sx={{
            zIndex: 1,
            textAlign: 'center'
          }}
        >
          {' '}
          <FormatDateToIST utcString={scheduled} />
        </TableCell>
        <TableCell
          sx={{
            zIndex: 1,
            textAlign: 'center'
          }}
        >
          {status}
        </TableCell>
        <TableCell
          sx={{
            zIndex: 1,
            textAlign: 'center'
          }}
        >
          {status === 'pending' ? (
            userId === user ? 
              <Button
              variant="outlined"
              sx={{
                zIndex: 1,
                backgroundColor: 'white', // White background to match the theme
                color: '#1976D2', // Blue text that matches your button color
                border: `1px solid #1976D2`, // Blue border for consistency
                textTransform: 'none',
                fontWeight: '500',
                padding: '6px 16px',
                '&:hover': {
                  backgroundColor: '#1976D2', // Blue background on hover
                  color: 'white' // White text on hover
                }
              }}
              onClick={handleOpenDialog}
            >
              Cancel
            </Button> 
            :<Button
            variant="outlined"
            color="secondary"
            sx={{cursor:"none"}}
          >
            Cancel
          </Button> 
           
          ) : (
            <Button
              variant="contained"
              sx={{
                zIndex: 1,
                backgroundColor: '#1976D2', // Blue that matches other buttons
                color: 'white',
                fontWeight: '500',
                padding: '6px 16px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                '&:hover': {
                  backgroundColor: '#115293' // A darker shade of blue on hover
                }
              }}
              onClick={() => {
                handleReport();
              }}
            >
              Report
            </Button>
          )}
        </TableCell>
      </TableRow>

      {showReport && (
        <Report
          resData={{
            smsSummary: data.smsSummary,
            successfulEmails: data?.emailSummary?.successfulEmails,
            failedEmails: data?.emailSummary?.failedEmails
          }}
          handleClose={handleClose}
        />
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Cancel Scheduled Task</DialogTitle>
        <DialogContent>Are you sure you want to cancel this task?</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>No</Button>
          <Button onClick={() => handleCancel(_id)} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ top: { sm: 90, xs: 75 }, right: { sm: 30, xs: 10 } }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Task cancelled successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default ScheduledRow;

const FormatDateToIST = ({ utcString }) => {
  const formatISTDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZone: 'Asia/Kolkata' // Use the desired time zone
    };

    const date = new Date(dateString);
    return date.toLocaleString('en-US', options);
  };

  return <span>{formatISTDate(utcString)}</span>;
};
