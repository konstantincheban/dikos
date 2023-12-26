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

export const useWebsocket = (options: IUseWebsocketOptions) => {
  const socket = io(`ws://localhost:6969/events`);
  socket.on('open', () => {
    if (options?.openedCb) {
      options.openedCb();
    } else {
      console.log(`WS Connection was opened: ${options.event}`);
    }
  });

  socket.on('message', (event) => {

    if (event.event === options.event) {
      if (event.data.status === 'progress') {
        options?.progressCb && options.progressCb(event.data);
      }
      if (event.data.status === 'success') {
        socket.disconnect();
        options?.successCb && options.successCb(event.data);
      }
      if (event.data.status === 'failed') {
        socket.disconnect();
        options?.failedCb && options.failedCb(event.data);
      }
    }
  });

  socket.on('close', () => {
    if (options?.closedCb) {
      options.closedCb();
    } else {
      console.log(`WS Connection was closed: ${options.event}`)
    }
  });

  return socket;
}