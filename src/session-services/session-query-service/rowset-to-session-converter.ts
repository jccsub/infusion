import { Log } from '../../logger';
import { Session } from './session';


export class RowsetToSessionConverter {

  private log : Log;

  constructor(log : Log) {
    this.log = log;
  }
  public convert(rows : any) : Array<Session>{
    let result = new Array<Session>();
    rows.forEach( (row) => {
      let sessionInfo = new Session(
        row.time,
        row.responseBody,
        row.responseHeaders,
        row.responseStatusCode,
        row.requestBody,
        row.requestHeaders,
        row.requestUrl,
        row.requestApplicationSessionId);
      result.push(sessionInfo);
    });
    return result;
  }


}