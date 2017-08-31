import { Configuration } from '../../domain/configuration';
import { Log } from '../../../logger';
export class OpenHandler {
  private log : Log;

  constructor(log : Log) {
    this.log = log;
  }

  public handle(proxySocket : any, configuration : Configuration) {
    
  }
}