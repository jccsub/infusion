

export class SessionInfo {
  public readonly time : Date;
  public readonly contextId : number;
  public readonly userName : string;
  public readonly sessionId : string;

  constructor(time : Date, contextId : number, userName : string, sessionId : string){
    this.time = time;    
    this.contextId = contextId;
    this.userName = userName;
    this.sessionId = sessionId;
  }
}