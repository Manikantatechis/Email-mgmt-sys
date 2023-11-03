import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import { Box, TextField, } from '@mui/material';

const TimeZoneClock = () => {
  const timeFormat = 'HH:mm'; // Updated to show only hours and minutes
  const timeZones = {
    IST: 'Asia/Kolkata',
    EST: 'America/New_York',
    CST: 'America/Chicago',
    MST: 'America/Denver',
    PST: 'America/Los_Angeles',
    // ALASKA: 'America/Anchorage',
  };

  // Initialize state for each time zone
  const initialTimes = () => Object.keys(timeZones).reduce((acc, key) => {
    acc[key] = moment().tz(timeZones[key]).format(timeFormat);
    return acc;
  }, {});

  const [times, setTimes] = useState(initialTimes);
  const [liveUpdate, setLiveUpdate] = useState(true);

  useEffect(() => {
    if (liveUpdate) {
      const intervalId = setInterval(() => {
        setTimes(initialTimes());
      }, 1000); // Could be set to 60000 ms for minute updates
      return () => clearInterval(intervalId);
    }
  }, [liveUpdate]);

  // Function to handle time changes
  const handleTimeChange = (zoneKey, newTime) => {
    setLiveUpdate(false); // Stop the live update when editing
    const timezone = timeZones[zoneKey];
    const momentTime = moment.tz(newTime, timeFormat, timezone);
    const updatedTimes = {};

    Object.keys(timeZones).forEach((key) => {
      updatedTimes[key] = momentTime.clone().tz(timeZones[key]).format(timeFormat);
    });

    setTimes(updatedTimes);
  };

  // Function to reset times to current moment
//   const resetTimes = () => {
//     setLiveUpdate(true); // Resume live update on reset
//     setTimes(initialTimes());
//   };

  // When user leaves the input field, stop the editing mode
  const handleBlur = () => {
    setLiveUpdate(true);
  };

  return (
    <Box sx={{ padding: 2 }}>

      <Box sx={{ display: 'flex', justifyContent: 'center',  gap: 2 }}>
        {Object.keys(times).map((zoneKey) => (
          <TextField
            key={zoneKey}
            label={zoneKey}
            type="time"
            variant="outlined"
            value={times[zoneKey]}
            onChange={(e) => handleTimeChange(zoneKey, e.target.value)}
            onBlur={handleBlur}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 60, // 60 sec (1 min) step for input type 'time'
            }}
            sx={{ minWidth: '120px' }}
          />
        ))}
        {/* <Button
          variant="contained"
          color="primary"
          onClick={resetTimes}
          sx={{ mt: 2 }}
        >
          Reset
        </Button> */}
      </Box>
    </Box>
  );
};

export default TimeZoneClock;



