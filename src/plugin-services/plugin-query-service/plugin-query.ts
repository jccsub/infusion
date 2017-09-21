import { PluginInfo } from './plugin-info';
import { PluginEnumerator } from './plugin-enumerator';
import { Log } from "../../logger";


export class PluginQuery {

  log : Log;
  pluginEnumerator : PluginEnumerator;
  constructor(log : Log, pluginEnumerator : PluginEnumerator) {
    this.log = log;
    this.pluginEnumerator = pluginEnumerator;
  }
  public pickPluginsForUrl(url : string, req : any) : Array<PluginInfo> {
    let allPlugins = this.pluginEnumerator.enumerate(req);
    let results = new Array<PluginInfo>();
    allPlugins.forEach( (plugin) => {
      let regEx = new RegExp(plugin.urlPattern,'i');
      if (regEx.test(url)) {
        results.push(plugin);
      }
    });
    return results;
  }
}