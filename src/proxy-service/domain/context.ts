import { Configuration } from './configuration';
import { InfusionModification } from './modification';
import { Request } from './request';
import { Response } from './response';
import { Log } from '../../logger';

export enum ContextDirection {
  Request,
  Response
}
export class Context {
  public response : Response = new Response();
  
    public readonly config : Configuration;
    public request : Request = new Request();
 
    public rewritePath : string = '';
  
    public error : Error;
  
    public direction : ContextDirection;

    public user : string;

     private log : Log;
    constructor(log : Log, config : Configuration) {
      this.config = config;
      this.log = log;
    }
  

    public toString() {
      let result ='';
      result += '\n---------------------------------------'
      result += '\ncontext = {\n';
      /* istanbul ignore next */
      // tslint:disable-next-line:triple-equals
      if (this.error != null) {  
        result += `\n\terror-message: ${this.error.message}`;
      }
      result += `\n\trequest-body: ${this.request.body}`;
      result += `\n\trequest-url: ${this.request.fullUrl}`;
      result += `\n\trequest-method: ${this.request.method}`;
      result += `\n\trequest-sessionId: ${this.request.sessionId}`;
      result += `\n\tresponse-headers: ${JSON.stringify(this.response.headers)}`;
      result += '\n---------------------------------------'
      return result;
    }

    public flatten() : object {
      let result : any = {};
      result.responseBody = this.response.body;
      result.responseHeaders = JSON.stringify(this.response.headers);
      result.responseStatusCode = this.response.statusCode;
      result.requestBody = this.request.body;
      result.requestHeaders = JSON.stringify(this.request.headers);
      result.requestUrl = this.request.fullUrl;
      result.requestProtocol = this.request.protocol;
      result.requestHost = this.request.host;
      result.requestMethod = this.request.method;
      result.requestApplicationSessionId = this.request.sessionId;
      result.modifications = JSON.stringify(this.config.modifications);
      result.rewritePath = this.rewritePath;
      result.error = this.error;
      result.user = this.user;  

      return result;
    }
  

}