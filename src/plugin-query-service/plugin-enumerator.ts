import { Log } from '../logger';
import { PluginInfoExtractor } from './plugin-info-extractor';
import { FileReader } from './file-reader';
import { FileEnumerator } from './file-enumerator';
import { PluginInfo } from './plugin-info';


export class PluginEnumerator {
  private fileEnumerator : FileEnumerator;
  private pluginPath : string;
  private fileReader  : FileReader;
  private log : Log;

  private cache? : Array<PluginInfo>;
  constructor(log: Log, fileEnumerator : FileEnumerator, fileReader : FileReader, pluginPath : string) {
    this.log = log;
    this.fileEnumerator = fileEnumerator;
    this.fileReader = fileReader;
    this.pluginPath = pluginPath;
    this.cache = undefined;
  }

  public enumerate(req : any) : Array<PluginInfo> {
    this.log.debug(`InfusionPluginEnumerator.enumerate()`);
    if (this.cache) {
      this.log.error('IN THE CACHE!!');
      return this.cache;
    }

    let results = new Array<PluginInfo>();
    
    let names;
    this.fileEnumerator.enumerate(this.pluginPath).forEach((file) => {
      if (file.indexOf('.js') >= 0) {
        let extractor = new PluginInfoExtractor(this.log);
        results.push(extractor.extract(file, this.fileReader.read(`${this.pluginPath}\\${file}`), req));
      }
    });  
    this.cache = results;
    return results;
  }
  
}