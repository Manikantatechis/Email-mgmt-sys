import React, { useState } from 'react';
import { Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box } from '@mui/material';
import AddCredentials from './AddCredentials'; // Import the AddCredentials component
import KixieRow from './row/kixieRow';
import CredentialRow from './row/credentialRow';
import { Grid } from '../../../node_modules/@mui/material/index';

const CredentialManager = () => {
  const [actionType, setActionType] = useState(null); // 'gmail' or 'kixie'
  const gmailCredentials = [
    { id: 1, emailId: 'example@gmail.com', status: 'Active' },
    { id: 1, emailId: 'example@gmail.com', status: 'Active' },
    { id: 1, emailId: 'example@gmail.com', status: 'Active' },
    { id: 1, emailId: 'example@gmail.com', status: 'Active' }
  ];

  const kixieCredentials = [
    { id: 1, name: 'John Doe', phoneNo: '1234567890', status: 'Active' },
    { id: 1, name: 'John Doe', phoneNo: '1234567890', status: 'Active' },
    { id: 1, name: 'John Doe', phoneNo: '1234567890', status: 'Active' },
    { id: 1, name: 'John Doe', phoneNo: '1234567890', status: 'Active' },
    { id: 1, name: 'John Doe', phoneNo: '1234567890', status: 'Active' },
  ];

  return (
    <Container>
      <Paper elevation={3} sx={{ borderRadius: 2, padding: 4, minHeight: '70vh' }}>
        <Grid>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 3 }}>
            <Container color="primary">Gmail</Container>
            <Button
              variant="contained"
              color="primary"
              style={{ whiteSpace: 'nowrap', padding: '7px 30px' }}
              onClick={() => setActionType('gmail')}
            >
              Add Gmail Credentials
            </Button>
          </Box>

          <TableContainer sx={{ height: '30vh', overflow: 'scroll' }} component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: '40%' }}>Email ID</TableCell>
                  <TableCell style={{ width: '20%' }}>Status</TableCell>
                  <TableCell style={{ width: '40%' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {gmailCredentials.map((cred) => (
                  <CredentialRow key={cred.id} {...cred} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <br />
        <br />
        <Grid>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 3 }}>
            <Container color="primary">Kixie</Container>
            <Button
              variant="contained"
              color="primary"
              style={{ whiteSpace: 'nowrap', padding: '7px 30px' }}
              onClick={() => setActionType('kixie')}
            >
              Add Kixie Credentials
            </Button>
          </Box>
          <TableContainer sx={{ height: '30vh', overflow: 'scroll' }} component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: '30%' }}>Name</TableCell>
                  <TableCell style={{ width: '30%' }}>Phone No</TableCell>
                  <TableCell style={{ width: '20%' }}>Status</TableCell>
                  <TableCell style={{ width: '20%' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {kixieCredentials.map((cred) => (
                  <KixieRow key={cred.id} {...cred} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        {actionType && <AddCredentials actionType={actionType} setActionType={setActionType} />}
      </Paper>
    </Container>
  );
};

export default CredentialManager;
