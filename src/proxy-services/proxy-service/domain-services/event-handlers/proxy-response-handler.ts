import { Log } from '../../../../logger';
import * as zlib from 'zlib';
import { Context } from '../../domain/context';
import { Configuration } from '../../domain/configuration';
import { ResponseHandler } from './response-handler';

export class ProxyResponseHandler {

  private log : Log;

  constructor(log : Log) {
    this.log = log;  
  }

  public handle(proxyRes : any, req : any, res : any) {
    let context = ((req as any).context as Context);
    
    // tslint:disable-next-line:triple-equals
    if (context == null) {
      throw new Error('InfusionProxyResponseHandler.handle - req.context cannot be null');
    }
        

    let resHandler = new ResponseHandler(this.log, context, proxyRes, res);    

    var encoding = proxyRes.headers['content-encoding']
    var output;
    
    /* istanbul ignore next */
    // tslint:disable-next-line:triple-equals
    if (encoding == 'gzip') {
      var gzip = zlib.createGunzip();
      proxyRes.pipe(gzip);
      output = gzip;
    }
    else {
      output = proxyRes;
    }
    
    output.on('data',(chunk) => {      
      resHandler.onData(chunk);
    });

    output.on('end',() => {
      resHandler.onEnd();
    });
  }


}