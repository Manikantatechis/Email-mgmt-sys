// material-ui
import { Box, IconButton, Link, useMediaQuery, Typography } from '@mui/material';
import { GithubOutlined } from '@ant-design/icons';

// project import
// import Search from './Search';
import Profile from './Profile';
import Notification from './Notification';

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
  const matchesXs = useMediaQuery((theme) => theme.breakpoints.down('md'));

  return (
    <>
      <Box sx={{ width: '100%', ml: { xs: 0, md: 1 } }}>
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

      {matchesXs && <Box sx={{ width: '100%', ml: 1 }} />}

      <IconButton
        component={Link}
        href="https://github.com/manikantatechis"
        target="_blank"
        disableRipple
        color="secondary"
        title="EMS"
        sx={{ color: 'text.primary', bgcolor: 'grey.100' }}
      >
        <GithubOutlined />
      </IconButton>

      <Notification />
      <Profile />
    </>
  );
};

export default HeaderContent;
