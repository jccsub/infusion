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

    this.app.use(function(req, res, next) {
      res.header('Access-Control-Allow-Origin', req.get('Origin') || '*');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
      res.header('Access-Control-Expose-Headers', 'Content-Length');
      res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
      if (req.method === 'OPTIONS') {
        return res.send(200);
      } else {
        return next();
      }
    });    

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
    //testing
    this.app.post('/urls', (req, res) => {
      let results = {
        "urls": ["http://127.0.0.1:8080/dist/mytest.js"  ]
      }
      res.send(results);
    })
    this.app.listen(port);
    this.log.info(`Session Query Service listening on port ${port}`);
  }
  
  

}