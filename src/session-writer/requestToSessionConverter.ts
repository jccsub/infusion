import { Session } from '../session-writer/session';

export class RequestToSessionConverter {

  public convert(request : any) : Session {
    let result = new Session();
    result.responseBody =request.responseBody;
    result.responseHeaders = request.responseHeaders;
    result.responseStatusCode = request.responseStatusCode;
    result.requestBody = request.requestBody;
    result.requestHeaders = request.requestHeaders;
    result.requestUrl = request.requestUrl;
    result.requestProtocol = request.requestProtocol;
    result.requestHost = request.requestHost;
    result.requestMethod = request.requestMethod;
    result.requestApplicationSessionId = request.requestApplicationSessionId;
    result.modifications = request.modifications;
    result.rewritePath = request.rewritePath;
    result.error = request.error;
    result.userName = request.user;
    return result;
  }
}