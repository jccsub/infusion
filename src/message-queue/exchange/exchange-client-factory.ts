import { ExchangeClient } from './exchange-client';


export interface ExchangeClientFactory {
  
  create(bindingKey : string) : ExchangeClient;
}