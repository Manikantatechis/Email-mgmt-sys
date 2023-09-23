import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Container, Grid, Button } from '@mui/material';

const SummaryTable = ({ summary, type }) => (
  <Table >
    <TableHead>
      <TableRow>
        <TableCell>Status</TableCell>
        {type === 'email' && <TableCell>To</TableCell>}
        <TableCell>{type === 'sms' ? 'Phone' : 'Status'}</TableCell>
        <TableCell>Additional Info</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {summary.map((item, index) => (
        <TableRow key={index}>
          <TableCell>{item.status}</TableCell>
          {type === 'email' && <TableCell>{item.value.to || 'N/A'}</TableCell>}
          <TableCell>{type === 'sms' ? (item.value.Phone || 'N/A') : (item.value.status || 'N/A')}</TableCell>
          <TableCell>{item.value.reason || 'N/A'}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);



const PreviewData = ({ resData, setResData }) => (
  <Container
    style={{
      width: '80%',
      position: 'fixed',
      height: '90vh',
      top: '65px',
      right: '0',
      background: '#09090957',
      overflow: 'scroll',
      padding:" 0 26px"
    }}
  >
    {resData?.smsSummary && resData?.smsSummary.length > 0 &&  (
      <Paper elevation={3} style={{ height: resData?.emailSummary.length > 0 ? '40vh' : '80vh', overflow: 'scroll' }}>
        <h2>SMS Summary</h2>
        <SummaryTable summary={resData.smsSummary} type="sms" />
      </Paper>
    )}

    {resData?.emailSummary && resData?.emailSummary.length > 0 && (
      <Paper elevation={3} style={{ marginTop: '20px', height: resData?.smsSummary.length > 0 ? '40vh' : '80vh', overflow: 'scroll' }}>
        <h2>Email Summary</h2>
        <SummaryTable summary={resData.emailSummary} type="email" />
      </Paper>
    )}

    <Grid item xs={12}>
          
          <Button variant="contained" color="secondary" onClick={()=>setResData(null)} fullWidth style={{ marginTop: '10px' }}>
            Close
          </Button>
        </Grid>
      

  </Container>
);

export default PreviewData;
