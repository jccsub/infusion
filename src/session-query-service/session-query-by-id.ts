import { SessionQueryConfiguration } from './session-query-configuration';
import { Log } from '../logger';

const sql = require('mssql');

export class SessionQueryById {

  private log : Log;
  private config : SessionQueryConfiguration;

  constructor(log : Log, config : SessionQueryConfiguration) {
    this.log = log;
    this.config = config;
  }

  public async query(sessionId : string) {
    const pool = new sql.ConnectionPool(this.config);
    pool.on('error', err => {
      this.log.error(`sql errors: ${err}`);
    });
    let result : any;
    await pool.connect(this.config);
    try {
       result = await pool.request()
      .input('requestApplicationSessionId', sql.Char(255), sessionId)      
      .query(`
        SELECT [contextId]
        ,[requestApplicationSessionId]
        ,[time]
        ,[responseBody]
        ,[responseHeaders]
        ,[responseStatusCode]
        ,[requestBody]
        ,[requestHeaders]
        ,[requestUrl]
        ,[requestProtocol]
        ,[requestHost]
        ,[requestMethod]
        ,[modifications]
        ,[rewritePath]
        ,[error]
        ,[userName]
    FROM [usproxy].[dbo].[session]
    WHERE [requestApplicationSessionId] = @requestApplicationSessionId
      `);
    }
    catch(err) {
      this.log.error(err);
      return {err : err};
    }
    finally {
      pool.close();
    }
    return result.recordset;    
  }

}