import * as zlib from 'zlib';
import { InfusionContext } from '../../domain/infusion-context';
import { Log } from '../../../logger';


export class InfusionResponseHandler {

  log : Log;
  context : InfusionContext;
  proxyRes : any;

  res : any;

  constructor(log : Log, context : InfusionContext, proxyRes : any, res : any) {
    this.log = log;
    this.context = context;
    this.proxyRes = proxyRes;
    this.context.response.body = '';
    this.res = res;
  }

  public onData(chunk : any) {
    this.context.response.body += chunk.toString('utf8');
  }

  public onEnd() {
    this.context.response.statusCode = this.proxyRes.statusCode;    
    this.context.response.headers = this.proxyRes.headers;
  }

}