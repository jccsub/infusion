import { MessageReceivedCallback } from '../message-received-callback';
import { ExchangeConnection } from './exchange-connection';


export class RabbitMqExchangeConnection implements ExchangeConnection {
 
  private channel : any;
  private exchange : string;
  private bindingKey : string;
  constructor(channel : any, exchange : string, bindingKey : string = '') {
    this.channel = channel;
    this.exchange = exchange;
    this.bindingKey = bindingKey;
  }

  
  public publish(message: any) {
    this.channel.publish(this.exchange, this.bindingKey, new Buffer(JSON.stringify(message)))
  }


  public subscribe(callback: MessageReceivedCallback) {
    let ok = this.channel.assertQueue('', {exclusive: true});
    ok = ok.then((qok) => {
      return this.channel.bindQueue(qok.queue, this.exchange, this.bindingKey).then( () => {
        return qok.queue;
      });
    });
    ok = ok.then( (queue) => {
      return this.channel.consume(queue, callback, {noAck: true});
    });
  }
}

