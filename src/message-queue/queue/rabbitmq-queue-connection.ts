import { MessageReceivedCallback } from '../message-received-callback';
import { Log } from '../../logger';
import { QueueConnection } from './queue-connection';


export class RabbitMqQueueConnection implements QueueConnection {
 
  private channel : any;
  private queue : string;
  private log : Log;

  constructor(log: Log, channel : any, queue : string) {
    this.log = log;
    this.channel = channel;
    this.queue = queue;
  }
  public send(message: any) {
    //From here: https://stackoverflow.com/a/39769745
    this.channel.sendToQueue(this.queue, new Buffer(JSON.stringify(message)));
  }

  public receive( callback : MessageReceivedCallback ) {        
    this.channel.consume(this.queue, (msg) => {
      let content = JSON.parse(msg.content);
      callback(msg);
    }, {noAck: true});
  }

}
