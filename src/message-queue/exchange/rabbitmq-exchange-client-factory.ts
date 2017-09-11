import { RabbitMqExchangeClient } from './rabbitmq-exchange-client';
import { ExchangeClient } from './exchange-client';
import { ExchangeClientFactory } from './exchange-client-factory';


export class RabbitMqExchangeClientFactory implements ExchangeClientFactory {

  private host: string;
  public bindingKey : string;
  constructor( host : string) {
    this.host = host;
  }
  public create(bindingKey : string): ExchangeClient {
    this.bindingKey = bindingKey;
    return new RabbitMqExchangeClient(this.host, this.bindingKey);
  }
}