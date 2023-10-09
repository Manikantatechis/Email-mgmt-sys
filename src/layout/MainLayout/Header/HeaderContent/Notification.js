import React, { useEffect, useState, useRef } from 'react';
import NotificationDisplay from './NotificationDisplay';
import { handleRequest } from 'services/Api';
import useWebSocket from 'customHooks/useWebSocket';

const Notification = () => {
  const userData = JSON.parse(localStorage.getItem('userData'));
  const userId = userData ? userData._id : "";
  
  // Now you can use userId safely without risking a null error
  

  const initialNotifications = JSON.parse(localStorage.getItem('userNotifications')) || [];
  const unseenNotifications = initialNotifications.filter((notif) => !notif.seen);
  const [viewAll, setViewAll] = useState(false);
  const [notifications, setNotifications] = useState(unseenNotifications);
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
    setViewAll(false);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(() => {
      setViewAll(false);
      return false;
    });
  };

  const socket = useWebSocket({
    url: process.env.REACT_APP_BACKEND_URL,
    query: { userId }
  });

  useEffect(() => {
    socket.current.on('notification', (data) => {
      const newNotification = data.data;
      console.log("Hello", newNotification)
      // Update the state and the localStorage simultaneously
      setNotifications((prevNotifications) => {
        const updatedNotifications = [...prevNotifications, newNotification];
        localStorage.setItem('userNotifications', JSON.stringify([...initialNotifications, newNotification]));
        return updatedNotifications;
      });
    });
  }, [socket, initialNotifications]);

  const handleClick = async () => {
    try {
      const res = await handleRequest('get', `/api/users/seen`);
      if (res) {
        const prevNotifications  = JSON.parse(localStorage.getItem("userNotifications"))

        const updatedNotifications = prevNotifications.map((notification) => ({ ...notification, seen: true }));

        // Update the localStorage with the seen notifications
        localStorage.setItem('userNotifications', JSON.stringify(updatedNotifications));
        setNotifications([]); // Empty the notifications state since we're only displaying unseen notifications
      }
    } catch (error) {
      console.error(error);
    }
  };

  const displayedNotifications = viewAll ? initialNotifications : notifications;

  return (
    <NotificationDisplay
      displayedNotifications={displayedNotifications}
      handleClick={handleClick}
      open={open}
      handleToggle={handleToggle}
      handleClose={handleClose}
      anchorRef={anchorRef}
      setViewAll={setViewAll}
    />
  );
};

export default Notification;
