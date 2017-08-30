import * as express from 'express';
import {NextFunction, Request, Response, Router, Application } from 'express'
import * as path from 'path';
import * as bodyParser from 'body-parser';


export class SessionWriterService {

  private app: Application;
  private router : Router;


  public static bootstrap(): SessionWriterService {
    return new SessionWriterService();
  }

  constructor() {
    this.app = express();

    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({
      extended: true,
      defer : true
    }));

    
    this.app.post('/',(req,res) => {
      res.send(req.body);
      console.log('received...')
    });  
  }

  public listen(port : number) {
    this.app.listen(port);
  }

}