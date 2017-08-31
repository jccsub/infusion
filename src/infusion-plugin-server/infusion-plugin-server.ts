import { InfusionPluginEnumerator } from './infusion-plugin-enumerator';
import { Log } from '../logger';
import * as express from 'express';

export class InfusionPluginServer {

  private app: any;
  private log : Log;
  private pluginPath : string;
  private pluginEnumerator : InfusionPluginEnumerator;

  constructor(log : Log, host : string, pluginPath : string, pluginEnumerator : InfusionPluginEnumerator) {
    this.app = express();
    this.log = log;
    this.pluginEnumerator = pluginEnumerator;
    this.pluginPath = pluginPath;
    this.app.use(express.static(this.pluginPath));         
  }

  public listen(port : number) {
    this.app.get('/plugins',(req,res) => {
      let pluginArray =  this.pluginEnumerator.enumerate(req);
      res.setHeader('Content-Type','application/json');
      res.send(JSON.stringify(pluginArray));
    });    
    this.app.listen(port);
    this.log.info(`InfusionPluginServer listening on port ${port}`);
  }

}