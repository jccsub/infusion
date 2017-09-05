import { FileReader } from '../plugin-query-service/file-reader';
import { Log } from '../logger';
import { PluginInfo } from './plugin-info';

export class PluginInfoExtractor {

  private log : Log;
  private fileReader : FileReader;
  private pluginPath : string;
  constructor(log: Log,fileReader : FileReader) {
    this.log = log;
    this.fileReader = fileReader;
  }
  public extract(pluginFileName : string, req : any) : PluginInfo {    
    let pluginContent = this.fileReader.read(pluginFileName);
    let name = this.GetPluginAttribute(pluginContent, 'PLUGIN.NAME');
    let pattern = this.GetPluginAttribute(pluginContent, 'PLUGIN.URLPATTERN');
    return new PluginInfo(name,`${req.protocol}://${req.get('host')}/${pluginFileName.replace(/^.*[\\\/]/, '')}`, pattern);
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