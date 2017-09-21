import { Log } from '../../../../logger';
import * as zlib from 'zlib';
import { Context } from '../../domain/context';


export class ResponseHandler {

  log : Log;
  context : Context;
  proxyRes : any;

  res : any;

  constructor(log : Log, context : Context, proxyRes : any, res : any) {
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