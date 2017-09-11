import { ExchangeConnection } from './exchange-connection';
import * as events from 'events';

export interface ExchangeClientConnectedCallback {
  (connection : ExchangeConnection) : void;
}

export interface ExchangeClient  {
  connect(exchange: string) : Promise<ExchangeConnection>;  
}