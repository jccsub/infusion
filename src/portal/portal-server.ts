import { Log } from '../logger';
import * as express from 'express';

export class PortalServer {

  private app: any;
  private log : Log;
  private clientPath : string;
  constructor(log : Log, clientPath : string ) {
    this.app = express();
    this.log = log;
    this.clientPath = clientPath;
    this.app.use(express.static(this.clientPath));         
  }

  public listen(port : number) {
    this.app.listen(port);
    this.log.info(`Portal Server listening on port ${port}`);
  }

}