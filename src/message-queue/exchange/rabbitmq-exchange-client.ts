import { RabbitMqExchangeConnection } from './rabbitmq-exchange-connection';
import { connect } from 'tls';
import { ExchangeConnection } from './exchange-connection';
import { ExchangeClient, ExchangeClientConnectedCallback} from './exchange-client';
import * as amqp from 'amqplib';


export class RabbitMqExchangeClient implements ExchangeClient {
  
  private host : string;
  private bindingKey : string;
  constructor(host : string, bindingKey : string = '') {
    this.host = host;
    this.bindingKey = bindingKey;
  }
  public connect(exchange : string)  : Promise<ExchangeConnection> {
    let connection : RabbitMqExchangeConnection | undefined;
    let connectionPromise = amqp.connect(this.host);
    let channelPromise = connectionPromise.then( (connection) => { return connection.createChannel(); });
    let assertExchangePromise = channelPromise.then((channel) => {
      connection = new RabbitMqExchangeConnection(channel,exchange, this.bindingKey);      
      if (this.bindingKey.length > 0)
        return channel.assertExchange(exchange,'direct', {duarable: false});
      else
        return channel.assertExchange(exchange,'fanout', {duarable: false});
    });
    let finishedConnectionPromise = assertExchangePromise.then(()=> {return Promise.resolve(connection)});
    return finishedConnectionPromise;
  }  

}