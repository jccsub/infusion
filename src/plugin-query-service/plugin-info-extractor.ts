import { Log } from '../logger';
import { PluginInfo } from './plugin-info';

export class PluginInfoExtractor {

  private log : Log;
  constructor(log: Log) {
    this.log = log;
  }
  public extract(pluginFileName : string, pluginContent : string, req : any) : PluginInfo {    
    let name = this.GetPluginAttribute(pluginContent, 'PLUGIN.NAME');
    let pattern = this.GetPluginAttribute(pluginContent, 'PLUGIN.URLPATTERN');
     return new PluginInfo(name,`${req.protocol}://${req.get('host')}/${pluginFileName}`, pattern);
  }

  private GetPluginAttribute(pluginContent : string, attributeName) : string {
    let result = '';
    const EQUALS_SIGN = 1;
    pluginContent.split('\n').some((line) => {
      let pos = line.indexOf(attributeName);
      if (pos >= 0) {
        result = line.substr(pos + attributeName.length + EQUALS_SIGN);
        return true;
      }
      return false;      
    });
    return result;
  }


}