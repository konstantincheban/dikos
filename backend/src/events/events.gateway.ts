import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, MessageBody, SubscribeMessage, ConnectedSocket } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server } from 'ws';
import { Socket } from 'socket.io'

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'events'
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;

  logger = new Logger('EventsGateway');

  handleConnection(client: Socket) {
    // Handle connection event
    this.logger.log('Connection was initiated');
  }

  handleDisconnect(client: Socket) {
    // Handle disconnection event
    this.logger.log('Connection was closed');
  }

  send(event: string, data: any) {
    // Handle received message
    this.server.emit('message', { event, data }); // Broadcast the message to all connected clients
  }

  // onApplicationBootstrap() {
  //   this.httpServer = this.app.getHttpServer();
  //   this.wss = new WebSocket.Server({ server: this.httpServer });

  //   this.wss.on('connection', ws => {
  //     ws.on('message', message => {
  //       this.logger.log(`Received message: ${message}`);
  //     });
  //     this.logger.log('Connection initiated.');
  //   });

  //   this.wss.on('error', err => {
  //     this.logger.error(`Connection terminated with an error: "${err.message}".`);
  //   });

  //   this.wss.on('close', () => {
  //     this.logger.log(`Connection was terminated.`);
  //   });
  // }

  // send(event: string, data: any) {
  //   this.wss.clients.forEach(client => {
  //     if (client.readyState === WebSocket.OPEN) {
  //       client.send(JSON.stringify({ event, data }));
  //     }
  //   });
  // }
}
