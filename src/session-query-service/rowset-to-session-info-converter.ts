import { SessionInfo } from './session-info';


export class RowsetToSessionInfoCoverter {
  public convert(rows : any) : Array<SessionInfo>{
    let result = new Array<SessionInfo>();
    rows.forEach( (row) => {
      let sessionInfo = new SessionInfo(row.time, row.contextId, row.userName, row.requestApplicationSessionId);
      result.push(sessionInfo);
    });
    return result;
  }
}