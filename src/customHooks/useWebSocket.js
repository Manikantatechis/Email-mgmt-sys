import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

const useWebSocket = (config) => {
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io(config.url, {
      query: config.query
    });

    socket.current.on('connect', () => {
      console.log('Connected to the server');
    });

    socket.current.on('connect_error', (error) => {
      console.log('Connection error:', error);
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [config.url, config.query]);

  return socket;
};

export default useWebSocket;
