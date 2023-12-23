import { WebSocketGateway, OnGatewayInit } from '@nestjs/websockets';
import * as WebSocket from 'ws';
import { Logger } from '@nestjs/common';

@WebSocketGateway()
export class EventsGateway implements OnGatewayInit {
  private wss: WebSocket.Server;

  logger = new Logger('EventsGateway');

  afterInit() {
    this.wss = new WebSocket.Server({ port: 6060 });

    this.wss.on('connection', ws => {
      ws.on('message', message => {
        this.logger.log(`Received message: ${message}`);
      });
      this.logger.log('Connection initiated.');
    });

    this.wss.on('error', err => {
      this.logger.error(`Connection terminated with an error: "${err.message}".`);
    });

    this.wss.on('close', () => {
      this.logger.log(`Connection was terminated.`);
    });
  }

  send(event: string, data: any) {
    this.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ event, data }));
      }
    });
  }
}
