import { PluginInfoExtractor } from './plugin-info-extractor';
import { FileEnumerator } from './file-enumerator';
import { PluginInfo } from './plugin-info';
import { Log } from "../../logger";


export class PluginEnumerator {
  private fileEnumerator : FileEnumerator;
  private pluginPath : string;
  private log : Log;
  private pluginInfoExtractor : PluginInfoExtractor;
  private cache? : Array<PluginInfo>;
  constructor(log: Log, pluginInfoExtractor: PluginInfoExtractor, fileEnumerator : FileEnumerator, pluginPath : string) {
    this.log = log;
    this.fileEnumerator = fileEnumerator;
    this.pluginPath = pluginPath;
    this.pluginInfoExtractor = pluginInfoExtractor;
    this.cache = undefined;
  }

  public enumerate(req : any) : Array<PluginInfo> {
    if (this.cache) {
      return this.cache;
    }
    let results = new Array<PluginInfo>();   
    let names;
    this.fileEnumerator.enumerate(this.pluginPath).forEach((file) => {
      if (file.indexOf('.js') >= 0) {
        results.push(this.pluginInfoExtractor.extract(`${this.pluginPath.replace(/\\$/,'')}\\${file}`,  req));
      }
    });  
    this.cache = results;
    return results;
  }
  
}