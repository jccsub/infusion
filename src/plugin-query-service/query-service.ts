import { PluginQuery } from './plugin-query';
import { PluginEnumerator } from './plugin-enumerator';
import { Log } from '../logger';
import * as express from 'express';

export class QueryService {

  private app: any;
  private log : Log;
  private pluginPath : string;
  private pluginEnumerator : PluginEnumerator;
  private pluginQuery : PluginQuery;

  constructor(log : Log, host : string, pluginPath : string, pluginEnumerator : PluginEnumerator, pluginQuery : PluginQuery) {
    this.app = express();
    this.log = log;
    this.pluginEnumerator = pluginEnumerator;
    this.pluginPath = pluginPath;
    this.pluginQuery = pluginQuery;
    this.app.use(express.static(this.pluginPath));         
  }

  public listen(port : number) {
    this.app.get('/plugins',(req,res) => {
      let pluginArray =  this.pluginEnumerator.enumerate(req);
      res.setHeader('Content-Type','application/json');
      res.send(JSON.stringify(pluginArray));
    });    
    this.app.get('/pluginsForUrl', (req, res) => {
      let url = req.query.url;
      if (url) {
        let pluginsForUrl = this.pluginQuery.pickPluginsForUrl(url, this.pluginEnumerator);
        res.send(JSON.stringify(pluginsForUrl))
      }

    });
    this.app.listen(port);
    this.log.info(`InfusionPluginServer listening on port ${port}`);
  }

}