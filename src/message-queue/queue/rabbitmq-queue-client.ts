import { connect } from 'tls';
import { Log } from '../../logger';
import { QueueConnection } from './queue-connection';
import { QueueClient,QueueClientConnectedCallback } from './queue-client';
import * as amqp from 'amqplib';
import { RabbitMqQueueConnection } from "./rabbitmq-queue-connection";


export class RabbitMqQueueClient implements QueueClient {
  private log : Log;

  constructor(log : Log) {
    this.log = log;
  }


  public connect(host: string, queue : string)  : Promise<QueueConnection> {
    let connection : RabbitMqQueueConnection | undefined;
    let connectionPromise = amqp.connect(host);
    let channelPromise = connectionPromise.then( (connection) => { return connection.createChannel(); });
    let assertQueuePromise = channelPromise.then((channel) => {
      connection = new RabbitMqQueueConnection(this.log,channel,queue);
      return channel.assertQueue(queue, {duarable: false})
    });
    let finishedConnectionPromise = assertQueuePromise.then(()=> {return Promise.resolve(connection)});
    return finishedConnectionPromise;
  }  
}