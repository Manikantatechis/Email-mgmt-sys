import React, { useEffect, useState } from 'react';
import { Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box } from '@mui/material';
import ScheduledRow from './row/ScheduledRow';
import { getAllScheduledTasks } from 'services/scheduledService';
import Loader from 'components/Loader';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const ScheduleManager = () => {
  const [scheduledData, setScheduledData] = useState(null); // Changed to null for initial state
  const [loading, setLoading] = useState(false);
  const pageSize = 50;
  const [page, setPage] = useState(1);

  const getData = async () => {
    setLoading(true);
    const resData = await getAllScheduledTasks(pageSize, page);
    if (resData) {
      setScheduledData(resData);
    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, [page]); // Fetch data when page changes

  const handleChange = (event, newPage) => {
    setPage(newPage);
  };
  const role = localStorage.getItem('userRole');
  const userId = JSON.parse(localStorage.getItem('userData'))._id;

  return (
    <>
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
          </TableContainer>{' '}
          {scheduledData&&
          <Stack spacing={2} sx={{width:"fit-content", margin:"0 auto", paddingTop:'20px'}}>
            <Pagination count={Math.ceil(scheduledData?.metadata.totalCount/pageSize)} page={page} onChange={handleChange} color="primary" />
          </Stack>
}
        </Paper>
      </Container>
    </>
  );
};

export default ScheduleManager;
