import { useState } from 'react';
// material-ui
import { Box, Button, Grid, Stack, Typography } from '@mui/material';

// project import
import IncomeAreaChart from './IncomeAreaChart';
import MonthlyBarChart from './MonthlyBarChart';
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import { useSelector } from '../../../node_modules/react-redux/es/exports';
import { selectTotalEmailsOpened, selectTotalEmailsSent, selectTotalSMSSent } from 'store/reports/reportsSlice';
import AnimateButton from 'components/@extended/AnimateButton';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const DashboardDefault = () => {
  const [slot, setSlot] = useState('week');
  const [refresh, setRefresh] = useState(false);

  const totalEmailsSent = useSelector(selectTotalEmailsSent) || localStorage.getItem('totalEmailsSent');
  const totalEmailsOpened = useSelector(selectTotalEmailsOpened) || localStorage.getItem('totalEmailsOpened');
  const totalSMSSent = useSelector(selectTotalSMSSent) || localStorage.getItem('totalSMSSent');

  const percentage = ((totalEmailsOpened / totalEmailsSent) * 100).toFixed(2);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Stack direction="row" alignItems="center" spacing={0} sx={{ position: 'fixed', top: '15vh', right: '5vw' }}>
       
        <AnimateButton type="scale">
        <Button size="medium" onClick={() => setRefresh(true)} color="primary" variant="contained">
          Refresh
        </Button>
        </AnimateButton>
      </Stack>
      {/* row 1 */}
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">Dashboard</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Total Emails Sent" count={totalEmailsSent || 0} />
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Total Emails Opened" count={totalEmailsOpened || 0} percentage={percentage || 0} color="warning" />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <AnalyticEcommerce title="Total SMS Sent" count={totalSMSSent || 0} />
      </Grid>
      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

      {/* row 2 */}
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Email Sent vs Opened</Typography>
          </Grid>
          <Grid item>
            <Stack direction="row" alignItems="center" spacing={0}>
              <Button
                size="small"
                onClick={() => setSlot('month')}
                color={slot === 'month' ? 'primary' : 'secondary'}
                variant={slot === 'month' ? 'outlined' : 'text'}
              >
                Month
              </Button>
              <Button
                size="small"
                onClick={() => setSlot('week')}
                color={slot === 'week' ? 'primary' : 'secondary'}
                variant={slot === 'week' ? 'outlined' : 'text'}
              >
                Week
              </Button>
            </Stack>
          </Grid>
        </Grid>
        <MainCard content={false} sx={{ mt: 1.5 }}>
          <Box sx={{ pt: 1, pr: 2 }}>
            <IncomeAreaChart slot={slot} refresh={refresh} setRefresh={setRefresh} />
          </Box>
        </MainCard>
      </Grid>
      <Grid item xs={12} md={5} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">SMS Count</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Box sx={{ p: 3, pb: 0 }}>
            <Stack spacing={2}>
              <Typography variant="h6" color="textSecondary">
                This Week SMS Stats
              </Typography>
            </Stack>
          </Box>
          <MonthlyBarChart refresh={refresh} setRefresh={setRefresh} />
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default DashboardDefault;
