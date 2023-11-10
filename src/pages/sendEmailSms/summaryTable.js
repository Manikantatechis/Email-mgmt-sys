import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Container, Grid, Button } from '@mui/material';
import { useSelector } from 'react-redux';

const SummaryTable = ({ summary, type }) => (
  <Table>
    <TableHead>
      <TableRow>
        <TableCell style-={{ textAlign: 'center' }}>SL No</TableCell>
        {type === 'email' && <TableCell style-={{ textAlign: 'center' }}>Email</TableCell>}
        {type === 'sms' && <TableCell style-={{ textAlign: 'center' }}>Phone</TableCell>}
        <TableCell style-={{ textAlign: 'center' }}>Status</TableCell>
        <TableCell style-={{ textAlign: 'center' }}>Additional Info</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {summary.map((item, index) => (
        <TableRow key={index}>
          <TableCell style-={{ textAlign: 'center' }}>{index + 1}</TableCell>
          {type === 'email' && <TableCell style-={{ textAlign: 'center' }}>{item.Email || 'N/A'}</TableCell>}
          {type === 'sms' && <TableCell style-={{ textAlign: 'center' }}>{item.value.Phone || 'N/A'}</TableCell>}
          <TableCell style-={{ textAlign: 'center' }}>{type === 'sms' ? item.value.status : item.status}</TableCell>
          <TableCell style-={{ textAlign: 'center' }}>
            {type === 'sms' ? (item.value && item.value.reason) || 'N/A' : item.reason || 'N/A'}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

const PreviewData = ({ resData, handleClose }) => {
  const sideBarOpen = useSelector((state) => state.menu.drawerOpen);
  console.log('Hello', sideBarOpen);
  return (
    <Container
      maxWidth="lg"
      style={{
        position: 'fixed',
        // left:"50%",
        height: '89vh',
        top: '95px',
        // transform:"translateX(-50%)",
        background: '#09090957',
        overflow: 'scroll',
        padding: '26px',
        margin: sideBarOpen ? null : '0 auto',
        right: sideBarOpen ? 25 : null,

        width: sideBarOpen ? '80%' : '100%',
        maxWidth: sideBarOpen ? '80%' : '100%',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column', // Ensure children stack vertically
        justifyContent: 'space-between' // Push content to the top and bottom
      }}
    >
      {resData?.smsSummary && resData?.smsSummary.length > 0 && (
        <Paper
          elevation={3}
          style={{ height: resData?.successfulEmails.length > 0 || resData?.failedEmails.length > 0 ? '40vh' : '80vh', overflow: 'scroll' }}
        >
          <h2 style={{ paddingLeft: 20 }}>SMS Summary</h2>
          <SummaryTable summary={resData.smsSummary} type="sms" />
        </Paper>
      )}
      {resData?.failedEmails && resData?.failedEmails.length > 0 && (
        <Paper
          elevation={3}
          style={{
            marginTop: '20px',
            height: resData?.smsSummary.length > 0 || resData?.successfulEmails.length > 0 ? '40vh' : '80vh',
            overflow: 'scroll'
          }}
        >
          <Grid sx={{ display: 'flex', alignItems: 'cemter', justifyContent: 'space-between' }}>
            <h2 style={{ paddingLeft: 20 }}>Failed Emails</h2>
            <Button size="medium" color="primary" variant="contained" sx={{ height: 'fit-content', margin: '20px' }}>
              Retry
            </Button>
          </Grid>

          <SummaryTable summary={resData.failedEmails} type="email" />
        </Paper>
      )}
      {resData?.successfulEmails && resData?.successfulEmails.length > 0 && (
        <Paper
          elevation={3}
          style={{
            marginTop: '20px',
            height: resData?.smsSummary.length > 0 || resData?.failedEmails.length > 0 ? '40vh' : '80vh',
            overflow: 'scroll'
          }}
        >
          <h2 style={{ paddingLeft: 20 }}>Successful Emails</h2>
          <SummaryTable summary={resData.successfulEmails} type="email" />
        </Paper>
      )}
<br />
      <Grid item xs={12} style={{ marginTop: 'auto' }}>
      <Button
      fullWidth
  variant="contained"
  onClick={() => handleClose(null)}
  style={{
    alignSelf: 'flex-end', // Aligns the button to the right
    padding: '10px 20px', // Suitable padding for a button
    backgroundColor: 'rgb(31 78 122)', // A deep shade of blue-grey, understated and sophisticated
    color: '#B0BEC5', // Light blue-grey text color for a subtle design
    fontWeight: '500', // Medium weight to maintain readability
    fontSize: '0.9rem', // Slightly smaller font size for a refined look
    borderRadius: '20px', // Fully rounded edges for a pill-shaped button, modern and stylish
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)', // A soft shadow for some depth
    transition: 'opacity 0.2s ease-in-out', // Fade transition for a subtle interactive effect
    '&:hover': {
      backgroundColor: '#546E7A', // A slightly lighter shade on hover for an interactive feel
      color: '#FFFFFF', // Brighter text on hover to maintain legibility
      opacity: 0.85, // Slight opacity change for a hover effect
    },
    '&:active': {
      opacity: 0.75, // More opacity change for a pressed effect
    },
  }}
>
  Close
</Button>

      </Grid>
    </Container>
  );
};

export default PreviewData;
