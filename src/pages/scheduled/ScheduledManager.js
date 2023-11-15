import React, { useEffect, useState } from 'react';
import { Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box } from '@mui/material';
import ScheduledRow from './row/ScheduledRow';
import { getAllScheduledTasks } from 'services/scheduledService';
import Loader from 'components/Loader';

const TemplateManager = () => {
  const [scheduledData, setScheduledData] = useState();
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(false);
    const resData = await getAllScheduledTasks();
    if (resData) {
      setScheduledData(resData);
      console.log(resData);
    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);
  const role = localStorage.getItem('userRole');
  const userId = JSON.parse(localStorage.getItem("userData"))._id
  console.log({userId})

  return (
    <Container>
      <Paper elevation={3} sx={{ borderRadius: 2, padding: 4, minHeight: '70vh' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 3, marginBottom: 3 }}>
          <Container component="span">Scheduled Messages</Container>
        </Box>
        {loading && <Loader />}

        <TableContainer component={Paper} sx={{ overflowY: 'scroll' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ textAlign: 'center' }}>Sl No</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>Type</TableCell>

                <TableCell sx={{ textAlign: 'center' }}>Count</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>Created</TableCell>

                <TableCell sx={{ textAlign: 'center' }}>Scheduled</TableCell>

                <TableCell sx={{ textAlign: 'center' }}>Status</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>Cancel/Report</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scheduledData &&
                scheduledData.data &&
                scheduledData.data.length > 0 &&
                scheduledData.data.map((data, index) => (
                  <ScheduledRow index={index} key={data._id} {...data} role={role} setScheduledData={setScheduledData} user={userId} />
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default TemplateManager;
