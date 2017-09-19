import { Log } from '../logger';
import * as express from 'express';

import * as path from 'path';
export class PortalServer {

  private app: any;
  private log : Log;
  private clientPath : string;

  constructor(log : Log, clientPath : string ) {
    this.app = express();
    this.log = log;
    this.clientPath = clientPath; 
    this.app.use(express.static(this.clientPath));
    // The "catchall" handler: for any request that doesn't
    // match one above, send back React's index.html file.
    //https://daveceddia.com/create-react-app-express-production/
    this.app.get('*', (req, res) => {
      res.sendFile(path.join(this.clientPath, 'index.html'));
    });    
  }

 
  public listen(port : number) {
    this.app.listen(port);
    this.log.info(`Portal Server listening on port ${port}`);
  }

  
}

