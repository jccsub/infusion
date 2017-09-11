import { ExchangeClientFactory } from './exchange/exchange-client-factory';
import { RabbitMqExchangeClient } from './exchange/rabbitmq-exchange-client';
import { MessageReceivedCallback } from './message-received-callback';
import { ExchangeClient } from './exchange/exchange-client';
import { MessagingEvent } from './messaging-events';

export interface EventEmittedCallback extends MessageReceivedCallback {

}

export class MessagingEventEmitter {

  private exchangeClient : ExchangeClient;

  public readonly id;
    
  constructor( exchangeClientFactory : ExchangeClientFactory) {
    this.id = generateUid();
    this.exchangeClient = exchangeClientFactory.create(this.id);
  }

  public on(event : MessagingEvent, callback : EventEmittedCallback) {
    this.exchangeClient.connect(event.name).then((connection)=> {
      connection.subscribe(callback);
    });
  }

  public emit(event : MessagingEvent, message: any) {
    this.exchangeClient.connect(event.name).then((connection) => {
      connection.publish(message);
    });
  }

}

function generateUid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
