import React from 'react';
import {
  Avatar,
  Badge,
  Box,
  IconButton,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Popper,
  Typography,
  useMediaQuery,
  useTheme,
  Divider,
  Grid,
  ClickAwayListener
} from '@mui/material';
import { BellOutlined, CloseOutlined, ReadOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';

const NotificationDisplay = ({ displayedNotifications, open, handleClick, handleToggle, handleClose, anchorRef, setViewAll }) => {
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));

  const avatarSX = {
    width: 36,
    height: 36,
    fontSize: '1rem'
  };

  const actionSX = {
    mt: '6px',
    ml: 1,
    top: 'auto',
    right: 'auto',
    alignSelf: 'flex-start',
    transform: 'none'
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <IconButton
        disableRipple
        color="secondary"
        sx={{ color: 'text.primary', bgcolor: open ? 'grey.300' : 'grey.100' }}
        aria-label="open notifications"
        ref={anchorRef}
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Badge badgeContent={displayedNotifications.filter((n) => !n.seen).length} color="primary">
          <BellOutlined />
        </Badge>
      </IconButton>
      <Popper
        placement={matchesXs ? 'bottom' : 'bottom-end'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [matchesXs ? -5 : 0, 9]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="fade" in={open} {...TransitionProps}>
            <Paper
              sx={{
                boxShadow: theme.customShadows.z1,
                width: '100%',
                minWidth: 285,
                maxWidth: 420,
                [theme.breakpoints.down('md')]: {
                  maxWidth: 285
                }
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard
                  title="Notifications"
                  elevation={0}
                  border={false}
                  content={false}
                  sx={{ overflow: 'scroll', maxHeight: '90vh' }}
                  secondary={
                    <Grid sx={{ display: 'flex', gap: '5px', width: '90%' }}>
                      <IconButton
                        size="small"
                        onClick={handleClick}
                        sx={{ display: 'flex', gap: '5px', border: '1px solid #ccc', width: '100%' }}
                      >
                        <ReadOutlined /> <span>{'Read All'}</span>
                      </IconButton>
                      <IconButton size="small" onClick={handleToggle}>
                        <CloseOutlined />
                      </IconButton>
                    </Grid>
                  }
                >
                  <List
                    component="nav"
                    sx={{
                      p: 0,
                      '& .MuiListItemButton-root': {
                        py: 0.5,
                        '& .MuiAvatar-root': avatarSX,
                        '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
                      }
                    }}
                  >
                    {displayedNotifications.map((notification, idx) => (
                      <React.Fragment key={idx}>
                        <ListItemButton>
                          <ListItemAvatar>
                            <Avatar
                              sx={{
                                color: 'primary.main',
                                bgcolor: 'primary.lighter'
                              }}
                            >
                              E
                            </Avatar>
                          </ListItemAvatar>

                          <ListItemText
                            primary={
                              <Typography variant="h6">
                                {notification.location
                                  ? notification.message === 'opened email'
                                    ? `User ${notification.email} opened the email from ${notification.location.city}, ${notification.location.region}, ${notification.location.country}.`
                                    : `User ${notification.email} reopened the email from ${notification.location.city}, ${notification.location.region}, ${notification.location.country}.`
                                  : notification.message === 'opened email'
                                  ? `User ${notification.email} opened the email.`
                                  : `User ${notification.email} reopened the email.`}
                              </Typography>
                            }
                            
                          />
                          <ListItemSecondaryAction>
                            <Typography variant="caption" noWrap>
                              {new Date(notification.time).toLocaleString('en-US', {
                                hour: 'numeric',
                                minute: 'numeric',
                                hour12: true,
                                month: 'numeric',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </Typography>
                          </ListItemSecondaryAction>
                        </ListItemButton>
                        <Divider />
                      </React.Fragment>
                    ))}
                    <ListItemButton sx={{ textAlign: 'center', py: `${12}px !important` }}>
                      <ListItemText
                        primary={
                          <Typography variant="h6" color="primary" onClick={() => setViewAll(true)}>
                            View All
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </List>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
};

export default NotificationDisplay;
