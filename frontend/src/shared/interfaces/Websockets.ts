export interface IWebsocketDataInterface {
  status: 'progress' | 'success' | 'failed';
}

export interface IWebsocketData {
  event: string;
  data: IWebsocketDataInterface
}
