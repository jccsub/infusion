import * as path from 'path';
import { InfusionContextWriter } from '../domain-services/infusion-context-writer';
import { InfusionContext, InfusionContextDirection } from '../domain/infusion-context';
import * as events from 'events';
import { MarkupModifier } from './markup-modifier';
import { InfusionConfiguration } from '../domain/infusion-configuration';
import { ModificationQueryFunction } from '../domain/infusion-modification';
import { InfusionProxyRequestHandler } from '../domain-services/event-handlers/infusion-proxy-request-handler';
import { InfusionProxyResponseHandler } from '../domain-services/event-handlers/infusion-proxy-response-handler';
import { InfusionErrorHandler } from '../domain-services/event-handlers/infusion-error-handler';
import { InfusionPathRewriteHandler } from '../domain-services/event-handlers/infusion-path-rewrite-handler';
import * as http from 'http';
import { SSL_OP_SINGLE_DH_USE } from 'constants';
import { Packet } from '_debugger';
import { Log } from '../../logger';
import * as proxy from 'http-proxy-middleware';
import * as express from 'express';


/*
Events:
  infusionResponse(context)
*/

export class ProxyService extends events.EventEmitter{
  private markupModifier: MarkupModifier;
  private log: Log;
  private proxy : any;  
  //private connectApp;
  private configuration : InfusionConfiguration;
  private writer : InfusionContextWriter;
  private expressApp : any;


  /* istanbul ignore next */
  constructor(log : Log, markupModifier : MarkupModifier, writer : InfusionContextWriter, configuration : InfusionConfiguration) {
    super();
    this.log = log;
    this.writer = writer;
    this.configuration = configuration;
    this.markupModifier = markupModifier;
    this.expressApp = express();
  }

  /* istanbul ignore next */
  public listen(infusionPort : number, target : string, port : number) {    
    this.proxy = this.createProxyServer(target);    

    this.expressApp.use(this.proxy);
    
    this.log.info(`ProxyService.listen(target: ${target}, port: ${port})`);
    http.createServer(this.expressApp).listen(port);
  }

  /* istanbul ignore next */
  private createProxyServer(target : string) {
    return proxy('/', {
      target : target,
      changeOrigin : true,
      agent : new http.Agent({keepAlive: true}),
      logLevel : this.log.level,
      pathRewrite: (path,req) => {
        this.log.debug(`ProxyService.setupProxyService.pathRewrite, path=${path}`);
        (req as any).newPath = '';
        new InfusionPathRewriteHandler(this.log).handle(path, req);
        if (req.newPath) {
          this.log.debug(`ProxyService.setupProxyService.pathRewrite - newPath=${req.newPath}`);          
          return req.newPath;
        }
      },
      onError : (err, req, res) => {new InfusionErrorHandler(this.log).handle(err, req, res); },
      onProxyRes : (proxyRes,req,res) => { 
        let context = (req as any).context as InfusionContext;
        this.markupModifier.performModifications(context.request.fullUrl, req, res);
        new InfusionProxyResponseHandler(this.log).handle(proxyRes, req, res);
        ((req  as any).context as InfusionContext).direction = InfusionContextDirection.Response;
        this.writer.write((req  as any).context as InfusionContext);
        this.emit('infusionResponse',((req  as any).context as InfusionContext));
      },
      onProxyReq : (proxyReq, req, res) => { 
        new InfusionProxyRequestHandler(this.log, this.configuration).handle(proxyReq, req, res);
        (req.context as InfusionContext).direction = InfusionContextDirection.Request;
      }
    });
  }

}