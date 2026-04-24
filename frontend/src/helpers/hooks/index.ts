import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

interface IUseWebsocketOptions {
  event: string;
  progressCb?: (...args: any[]) => void;
  successCb?: (...args: any[]) => void;
  failedCb?: (...args: any[]) => void;
  openedCb?: () => void;
  closedCb?: () => void;
}

export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const createWebsocket = (options: IUseWebsocketOptions) => {
  const wsUrl = import.meta.env.VITE_WS_URL || window.location.origin;
  const socket = io(`${wsUrl}/events`, { transports: ['websocket'] });
  socket.on('connect', () => {
    if (options?.openedCb) {
      options.openedCb();
    } else {
      console.log(`WS Connection was opened: ${options.event}`);
    }
  });

  socket.on('message', (event) => {
    if (event.event === options.event) {
      if (event.data.status === 'progress') {
        if (options.progressCb) {
          options.progressCb(event.data);
        }
      }
      if (event.data.status === 'success') {
        socket.disconnect();
        if (options.successCb) {
          options.successCb(event.data);
        }
      }
      if (event.data.status === 'failed') {
        socket.disconnect();
        if (options.failedCb) {
          options.failedCb(event.data);
        }
      }
    }
  });

  socket.on('disconnect', () => {
    if (options?.closedCb) {
      options.closedCb();
    } else {
      console.log(`WS Connection was closed: ${options.event}`);
    }
  });

  socket.on('error', (error) => {
    // TODO: better error handling
    console.error(`WS Error: ${error}`);
  });

  return socket;
};
