export class Session{
  public readonly time : Date;
  public readonly responseBody : string;
  public readonly responseHeaders : string;
  public readonly responseStatusCode : string;
  public readonly requestBody : string;
  public readonly requestHeaders : string;
  public readonly requestUrl : string;
  public readonly requestApplicationSessionId : string;

  constructor(
    time : Date,
    responseBody : string, 
    responseHeaders: string,
    responseStatusCode: string,
    requestBody : string,
    requestHeaders : string,
    requestUrl : string,
    requestApplicationSessionId : string) {
      this.time = time;
      this.responseBody = responseBody;
      this.responseHeaders = responseHeaders;
      this.responseStatusCode = responseStatusCode;
      this.requestBody = requestBody;
      this.requestHeaders = requestHeaders;
      this.requestUrl = requestUrl;
      this.requestApplicationSessionId = requestApplicationSessionId;
  }
}