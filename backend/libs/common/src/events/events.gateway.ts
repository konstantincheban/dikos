import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'events',
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;

  logger = new Logger('EventsGateway');

  handleConnection() {
    // Handle connection event
    this.logger.log('Connection was initiated');
  }

  handleDisconnect() {
    // Handle disconnection event
    this.logger.log('Connection was closed');
  }

  // TODO: sync this process more accurate and clear, it's a temp solution
  send(event: string, data: any) {
    // Handle received message
    this.logger.log(`WS Event [${event}]: status - ${JSON.stringify(data, null, 2)}`);
    let attempts = 0;
    const maxAttempts = 3;
    const intervalId = setInterval(() => {
      // Emit the event and check if there were listeners
      const status = this.server.emit('message', { event, data }); // Broadcast the message to all connected clients
      if (status) {
        this.logger.log(`WS Event [${event}]: The message was received by listeners.`);
        clearInterval(intervalId); // Clear the interval if there were listeners
      } else {
        attempts++;
        this.logger.log(`WS Event [${event}]: Attempt ${attempts}: No listeners yet.`);
        if (attempts >= maxAttempts) {
          this.logger.log(`WS Event [${event}]: Maximum attempts reached. Stopping retries.`);
          clearInterval(intervalId); // Clear the interval after maximum attempts
        }
      }
    }, 1000);
  }
}
