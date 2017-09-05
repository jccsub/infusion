import { Session } from '../session-writer-service/session';
import { SessionWriterConfiguration } from './session-writer-configuration';
import { Log } from '../logger';


const sql = require('mssql');

export class InfusionContextMssqlWriterConfig  {
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

export class SessionWriter {
  
  private log : Log;
  private config : SessionWriterConfiguration;
  constructor(log : Log, config: SessionWriterConfiguration) {
    this.log = log;
    this.config = config;
  }
  public async write(session : Session) {

    if (this.isIrrelevantUrl(session)) {
      return;
    }

    if (this.isIrrelevantResponseTypes(session)) {
      this.log.error('FOUND!!!');
      return;
    }

    const pool = new sql.ConnectionPool(this.config);
    pool.on('error', err => {
      this.log.error(`sql errors: ${err}`);
    });

    await pool.connect(this.config);
    try {
      let result = await pool.request()       
      .input('responseBody', sql.VarChar(sql.MAX), session.responseBody)
      .input('responseHeaders', sql.VarChar(8000), JSON.stringify(session.responseHeaders))
      .input('responseStatusCode', sql.Char(255), session.responseStatusCode)
      .input('requestBody', sql.VarChar(sql.MAX), session.requestBody)
      .input('requestHeaders', sql.VarChar(8000), JSON.stringify(session.requestHeaders))
      .input('requestUrl', sql.VarChar(3000), session.requestUrl)
      .input('requestProtocol', sql.Char(10), session.requestProtocol)
      .input('requestHost', sql.VarChar(3000), session.requestHost)
      .input('requestMethod', sql.Char(10), session.requestMethod)
      .input('requestApplicationSessionId', sql.Char(255), session.requestApplicationSessionId)
      .input('modifications', sql.VarChar(4000), JSON.stringify(session.modifications))
      .input('rewritePath', sql.Char(255), session.rewritePath)
      .input('error', sql.VarChar(2000), session.error)
      .input('userName', sql.Char(255), session.userName)
      .query(`
          INSERT INTO [session]
          ([time]
          ,[responseBody]
          ,[responseHeaders]
          ,[responseStatusCode]
          ,[requestBody]
          ,[requestHeaders]
          ,[requestUrl]
          ,[requestProtocol]
          ,[requestHost]
          ,[requestMethod]
          ,[requestApplicationSessionId]
          ,[modifications]
          ,[rewritePath]
          ,[error]
          ,[userName])
      VALUES (
          GETDATE()
          ,@responseBody
          ,@responseHeaders
          ,@responseStatusCode
          ,@requestBody
          ,@requestHeaders
          ,@requestUrl
          ,@requestProtocol
          ,@requestHost
          ,@requestMethod
          ,@requestApplicationSessionId
          ,@modifications
          ,@rewritePath
          ,@error
          ,@userName
        )`
      )
    }
    catch(err) {
      this.log.error(err);
      return {err : err};
    }
    finally {
      pool.close();
    }
  }

  public async initialize() {
    try {
      let pool =await sql.connect(this.config);
      if (pool) {
        this.log.debug('created sql pool');
      }
      let result = await pool.request().query(`
          IF  NOT EXISTS (SELECT * FROM sys.objects 
            WHERE object_id = OBJECT_ID(N'[dbo].[session]') 
            AND type in (N'U'))
            CREATE TABLE [dbo].[session](
              [contextId] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
              [time] [datetime] DEFAULT GETDATE() NOT NULL,
              [responseBody] [VarChar](max) NULL,
              [responseHeaders] [VarChar](8000) NULL,
              [responseStatusCode] [Char](255) NULL,
              [requestBody] [VarChar](max) NULL,
              [requestHeaders] [VarChar](8000) NULL,
              [requestUrl] [VarChar](3000) NULL,
              [requestProtocol] [Char](10) NULL,
              [requestHost] [VarChar](3000) NULL,
              [requestMethod] [Char](10) NULL,
              [requestApplicationSessionId] [Char](255) NULL,
              [modifications] [VarChar](4000) NULL,
              [rewritePath] [Char](255) NULL,
              [error] [VarChar](2000) NULL,
              [userName] [Char](255) NULL
            )

          `)
        }
        catch(err) {
          this.log.error(`err: ${err.message}`)
        }
  }

  private isIrrelevantUrl(session : Session) : boolean {
    return (this.config.irrelevantUrlSubstrings.some((s) => {
      return session.requestUrl.toLowerCase().indexOf(s) >= 0;
    }));
  }

  private isIrrelevantResponseTypes(session : Session) : boolean {
    if (!session.responseHeaders) {
      return false;
    }
     this.config.irrelevantResponseContentTypes.forEach((pattern) => {
      let contentType = session.responseHeaders['content-type'];
      if (contentType) {
        if (pattern.test(contentType)) {
          return true;
        }
      }
    })
    return false;
  }

}