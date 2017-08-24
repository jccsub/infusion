import { InfusionConfiguration } from '../../domain/infusion-configuration';
import { InfusionContext } from '../../domain/infusion-context';
import { InfusionRequestHandler } from './infusion-request-handler';
import { Log } from '../../../logger';

export class InfusionProxyRequestHandler {
 
  private log : Log;
  private config : InfusionConfiguration;
  constructor(log : Log, config : InfusionConfiguration) {
    this.log = log;
    this.config = config;
  }

  public handle(proxyReq : any, req : any, res : any) {
    // tslint:disable-next-line:triple-equals
    let context = (req.context == null) ? new InfusionContext(this.log, this.config) : req.context;
    context.request.body = '';    
    this.setupRequestHandler(req,context);
  }

  private setupRequestHandler(req : any, context : InfusionContext) {
    let reqHandler = new InfusionRequestHandler(this.log,req,context);
    req.context = context;
    req.on('data',(chunk) => { reqHandler.onData(chunk); })
    req.on('end',() => reqHandler.onEnd());
  }

  
}