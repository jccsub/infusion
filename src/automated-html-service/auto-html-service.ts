import * as events from 'events';
import * as express from 'express';
import { Log } from '../logger';

export class AutomatedHtmlService extends events.EventEmitter {

  private app : any;

  private log : Log;

  constructor(log : Log) {
    super();
    this.log = log;
    this.app = express();
    var bodyParser = require('body-parser')
    this.app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
      extended: false
    }));    

    this.app.use( bodyParser.json() );       // to support JSON-encoded bodies

    this.log.debug(`dir = ${__dirname}`);

  }

  public listen(port : number) {
    this.app.post('/',(req, res) => {
      res.send(req.body);
    });
    this.app.listen(port);
    this.log.info(`AutomateHtmlService listening on port ${port}`);
  }
  
  

}