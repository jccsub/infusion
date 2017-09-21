import { Log } from '../../logger';
import { ServiceBus, ServiceBusListenCallback } from './servicebus';

const bus = require('servicebus').bus();


export class RabbitMqServiceBus implements ServiceBus {

  private log : Log;
  constructor(log : Log) {
    this.log = log;
  }

  public listen(event: string, callback: ServiceBusListenCallback) {
    bus.listen(event, callback);
  }

  public send(event: string, message: any) {
    bus.send(event, message);
  }

  public subscribe(event: string, callback: ServiceBusListenCallback) {
    bus.subscribe(event, callback);
  }

  public publish(event: string, message: any) {
    bus.publish(event, message);
  }
}