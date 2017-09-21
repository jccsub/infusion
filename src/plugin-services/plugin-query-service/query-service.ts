import * as events from 'events';
import { PluginQuery } from './plugin-query';
import { PluginEnumerator } from './plugin-enumerator';
import * as express from 'express';
import { Log } from "../../logger";

export class QueryService extends events.EventEmitter{

  private app: any;
  private log : Log;
  private pluginPath : string;
  private pluginEnumerator : PluginEnumerator;
  private pluginQuery : PluginQuery;

  constructor(log : Log, host : string, pluginPath : string, pluginEnumerator : PluginEnumerator, pluginQuery : PluginQuery) {
    super();
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
        let pluginsForUrl = this.pluginQuery.pickPluginsForUrl(url, req);
        this.emit('pluginsForUrl',url, pluginsForUrl);
        res.send(JSON.stringify(pluginsForUrl))
      }

    });
    this.app.listen(port);
    this.log.info(`InfusionPluginServer listening on port ${port}`);
  }

}