import { QueueConnection } from './queue-connection';
import * as events from 'events';

export interface QueueClientConnectedCallback {
  (connection : QueueConnection) : void;
}
export interface QueueClient  {
  connect(host: string, queue: string, connectedCallback : QueueClientConnectedCallback);  
}