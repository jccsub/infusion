import { SessionWriterConfiguration } from './session-writer-configuration';
import { SessionWriter } from './session-writer';
import { RequestToSessionConverter } from './requestToSessionConverter';
import { Log } from '../logger';
import * as express from 'express';
import {NextFunction, Request, Response, Router, Application } from 'express'
import * as path from 'path';
import * as bodyParser from 'body-parser';


export class SessionWriterService {

  private app: Application;
  private router : Router;
  private log : Log;

  constructor(log: Log, config : SessionWriterConfiguration) {
    this.log = log;
    this.app = express();    
    this.app.use(bodyParser.urlencoded({
      extended: true,
      defer : true
    }));
    let converter = new RequestToSessionConverter();
    let writer = new SessionWriter(this.log, config);
    writer.initialize();
    this.app.use(bodyParser.json());
    this.app.post('/',(req,res) => {
      let reqToWrite = converter.convert(req.body);
      writer.write(reqToWrite);
      res.send('ok');
    });  
  }

  public listen(port : number) {
    this.app.listen(port);
    this.log.info('Session writer service listening on port ' + port);
  }

}