import { InfusionConfiguration } from '../../domain/infusion-configuration';
import { Log } from '../../../logger';
export class InfusionOpenHandler {
  private log : Log;

  constructor(log : Log) {
    this.log = log;
  }

  public handle(proxySocket : any, configuration : InfusionConfiguration) {
    
  }
}