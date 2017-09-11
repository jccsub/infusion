import { MessageReceivedCallback } from '../message-received-callback';


export interface QueueConnection {
  send(message : any);  
  receive( callback : MessageReceivedCallback );
}