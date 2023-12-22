import { IWebsocketData } from '@shared/interfaces/Websockets';
import { useEffect, useRef } from 'react';

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
  const ws = new WebSocket('ws://localhost:6060');
  ws.onopen = () => {
    if (options?.openedCb) {
      options.openedCb();
    } else {
      console.log(`WS Connection was opened: ${options.event}`);
    }
  };

  ws.onmessage = (event) => {
    const data: IWebsocketData = JSON.parse(event.data as string);

    if (data.event === options.event) {
      if (data.data.status === 'progress') {
        options?.progressCb && options.progressCb(data.data);
      }
      if (data.data.status === 'success') {
        ws.close();
        options?.successCb && options.successCb(data.data);
      }
      if (data.data.status === 'failed') {
        ws.close();
        options?.failedCb && options.failedCb(data.data);
      }
    }
  };

  ws.onclose = () => {
    if (options?.closedCb) {
      options.closedCb();
    } else {
      console.log(`WS Connection was closed: ${options.event}`)
    }
  };

  return ws;
}