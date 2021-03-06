import { Log } from '../../../logger';
import * as path from 'path';
import { Context, ContextDirection } from '../domain/context';
import * as events from 'events';
import { MarkupModifier } from './markup-modifier';
import { Configuration } from '../domain/configuration';
import { ModificationQueryFunction } from '../domain/modification';
import { ProxyRequestHandler } from '../domain-services/event-handlers/proxy-request-handler';
import { ProxyResponseHandler } from '../domain-services/event-handlers/proxy-response-handler';
import { ErrorHandler } from '../domain-services/event-handlers/error-handler';
import { PathRewriteHandler } from '../domain-services/event-handlers/path-rewrite-handler';
import * as http from 'http';
import { SSL_OP_SINGLE_DH_USE } from 'constants';
import { Packet } from '_debugger';
import * as proxy from 'http-proxy-middleware';
import * as express from 'express';

/*
Events:
  infusionResponse(context)
*/
export const RANDOM_UNUSED_PORT = 0;

export class ProxyService {
  private markupModifier: MarkupModifier;
  private log: Log;
  private proxy : any;  
  //private connectApp;
  private configuration : Configuration;
  private expressApp : any;


  /* istanbul ignore next */
  constructor(log : Log, markupModifier : MarkupModifier, configuration : Configuration) {
    this.log = log;
    this.configuration = configuration;
    this.markupModifier = markupModifier;
    this.expressApp = express();
  }

  /* istanbul ignore next */
  public listen(target : string, port : number = RANDOM_UNUSED_PORT) : Promise<number>{    
    this.log.warn('ProxyService.listen()')
    this.proxy = this.createProxyServer(target);    
    this.log.warn('ProxyService.listen() - created proxy server')
    this.expressApp.use(this.proxy);   
    this.log.info(`ProxyService.listen(target: ${target}, port: ${port})`);
    return new Promise<number>( (resolve) => {
        let server = http.createServer(this.expressApp);
        server.on('listening',() => {
          resolve(server.address().port);
        });
        server.listen(port);
    });    
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
        new PathRewriteHandler(this.log).handle(path, req);
        if (req.newPath) {
          this.log.debug(`ProxyService.setupProxyService.pathRewrite - newPath=${req.newPath}`);          
          return req.newPath;
        }
      },
      onError : (err, req, res) => {new ErrorHandler(this.log).handle(err, req, res); },
      onProxyRes : (proxyRes,req,res) => { 
        let context = (req as any).context as Context;
        this.markupModifier.performModifications(req, res);
        new ProxyResponseHandler(this.log).handle(proxyRes, req, res);
        context.direction = ContextDirection.Response;
      },
      onProxyReq : (proxyReq, req, res) => { 
        new ProxyRequestHandler(this.log, this.configuration).handle(proxyReq, req, res);
        (req.context as Context).direction = ContextDirection.Request;
      }
    });
  }

}