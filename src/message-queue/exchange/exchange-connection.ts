import { MessageReceivedCallback } from '../message-received-callback';

export interface ExchangeConnection {
  publish(message : any);
  subscribe( callback : MessageReceivedCallback );
}