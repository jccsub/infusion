import { Log } from '../logger';
import * as express from 'express';
import * as session from 'express-session';

export class PortalServer {

  private app: any;
  private log : Log;
  private clientPath : string;
  constructor(log : Log, clientPath : string ) {
    this.app = express();
    var session = require('express-session');
    this.log = log;
    this.clientPath = clientPath;
    this.app.use(session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false }
    }))
    this.app.use(express.static(this.clientPath));         
  }

  public listen(port : number) {
    this.app.listen(port);
    this.log.info(`Portal Server listening on port ${port}`);
  }

}

