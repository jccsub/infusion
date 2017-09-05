import { SessionQueryConfiguration } from './session-query-configuration';
import { Log } from '../logger';

const sql = require('mssql');

export class InfusionContextMssqlQueryConfig  {
  public pool : any;
  private user : string;
  private password : string;


  constructor(user : string, password : string, server : string, database : string) {

    this.pool = {
      max : 10,
      min : 0,
      idleTimeoutMillis: 30000
    }
  }
}

export class SessionQueryAll {

  private log : Log;
  private config : SessionQueryConfiguration;

  constructor(log : Log, config : SessionQueryConfiguration) {
    this.log = log;
    this.config = config;
  }

  public async query() {
    const pool = new sql.ConnectionPool(this.config);
    pool.on('error', err => {
      this.log.error(`sql errors: ${err}`);
    });
    let result : any;
    await pool.connect(this.config);
    try {
       result = await pool.request()
      .query(`
          SELECT 
            DISTINCT
            [contextId]
            ,[time]
            ,[userName]
            ,[requestApplicationSessionId]
          FROM
            [session] sess
          WHERE time = (
            SELECT MIN(time) 
            FROM session sess2 
            WHERE 
              sess2.requestApplicationSessionId = sess.requestApplicationSessionId
              AND sess2.requestUrl like '%newsession%'
          )        
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