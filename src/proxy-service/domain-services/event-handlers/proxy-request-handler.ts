import { Configuration } from '../../domain/configuration';
import { Context } from '../../domain/context';
import { RequestHandler } from './request-handler';
import { Log } from '../../../logger';

export class ProxyRequestHandler {
 
  private log : Log;
  private config : Configuration;
  constructor(log : Log, config : Configuration) {
    this.log = log;
    this.config = config;
  }

  public handle(proxyReq : any, req : any, res : any) {
    // tslint:disable-next-line:triple-equals
    let context = (req.context == null) ? new Context(this.log, this.config) : req.context;
    context.request.body = '';    
    this.setupRequestHandler(req,context);
  }

  private setupRequestHandler(req : any, context : Context) {
    let reqHandler = new RequestHandler(this.log,req,context);
    req.context = context;
    req.on('data',(chunk) => { reqHandler.onData(chunk); })
    req.on('end',() => reqHandler.onEnd());
  }

  
}