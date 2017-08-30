import * as express from 'express';
import {NextFunction, Request, Response, Router, Application } from 'express'
import * as path from 'path';
import * as bodyParser from 'body-parser';


/**
 * The server.
 *
 * @class Server
 */
export class InfusionPluginServer {

  private app: Application;
  private router : Router;


  public static bootstrap(): InfusionPluginServer {
    return new InfusionPluginServer();
  }

  constructor() {
    this.app = express();
    this.router = this.app.Router();
    this.app.use(this.router);
    this.app.use(express.static(path.join(__dirname, 'plugins')));
    this.router.get('/plugin-info', (req, res) => {
      
    });

  }

}