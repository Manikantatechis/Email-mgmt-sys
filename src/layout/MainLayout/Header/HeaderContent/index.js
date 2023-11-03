// material-ui
import { Box,useMediaQuery, Typography } from '@mui/material';

import Profile from './Profile';
import Notification from './Notification';
import TimeZoneClock from './TimeZoneClock';


// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
  const matchesXs = useMediaQuery((theme) => theme.breakpoints.down('md'));

  return (
    <>
    <Box sx={{display:"flex", justifyContent:"space-between", width:"100%", alignItems:"center"}}>

  
      <Box sx={{ width: 'fit-content', ml: { xs: 0, md: 1 },  }}>
        <Typography
          variant="h1"
          component="h2"
          sx={{
            margin: 0,
            fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
            fontWeight: 500,
            fontSize: '1.25rem',
            lineHeight: 1.6,
            letterSpacing: ' 0.0075em'
          }}
        >
          Tech IS Customer Outreach
        </Typography>
      </Box>
      <Box>

      {!matchesXs && <TimeZoneClock />}

      {matchesXs && <Box sx={{ width: '100%', ml: 1 }} />}
      </Box>

<Box sx={{display:"flex", alignItems:"center"}}>
        <Notification />
      <Profile />
</Box>
     


      </Box>
    </>
  );
};

export default HeaderContent;
