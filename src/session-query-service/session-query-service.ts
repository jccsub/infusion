import { RowsetToSessionConverter } from './rowset-to-session-converter';
import { SessionQueryById } from './session-query-by-id';
import { RowsetToSessionInfoCoverter } from './rowset-to-session-info-converter';
import { SessionQueryAll } from './session-query-all';
import * as events from 'events';
import * as express from 'express';
import { Log } from '../logger';

export class SessionQueryService extends events.EventEmitter {

  private app : any;
  private log : Log;
  private queryAll : SessionQueryAll;
  private queryById : SessionQueryById;
  constructor(log : Log, queryAll : SessionQueryAll, queryById : SessionQueryById) {
    super();
    this.log = log;
    this.app = express();
    this.queryAll = queryAll;
    this.queryById = queryById;
  }

  public listen(port : number) {
    this.app.get('/all',async (req, res) => {
      let rows = await this.queryAll.query();
      let converter = new RowsetToSessionInfoCoverter();
      let results = converter.convert(rows);
      res.send(results);
    });
    this.app.get('/query',async(req, res) => {
      let rows = await this.queryById.query(req.query.id);
      let converter = new RowsetToSessionConverter(this.log);
      let results = converter.convert(rows);
      res.send(results);
    });
    this.app.listen(port);
    this.log.info(`Session Query Service listening on port ${port}`);
  }
  
  

}