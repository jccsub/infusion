import { Log } from '../logger';
import * as fs from 'fs';
import { InfusionPluginInfoExtractor } from './infusion-plugin-info-extractor';
import { FileReader } from './file-reader';
import { FileEnumerator } from './file-enumerator';
import { InfusionPluginInfo } from './infusion-plugin-info';


export interface InfusionPluginEnumeratorCallback {
  (pluginInfo: InfusionPluginInfo) : void;
}

export class InfusionPluginEnumerator {
  private fileEnumerator : FileEnumerator;
  private pluginPath : string;
  private fileReader  : FileReader;
  private log : Log;
  constructor(log: Log, fileEnumerator : FileEnumerator, fileReader : FileReader, pluginPath : string) {
    this.log = log;
    this.fileEnumerator = fileEnumerator;
    this.fileReader = fileReader;
    this.pluginPath = pluginPath;
  }

  public enumerate(req : any) : Array<InfusionPluginInfo> {
    let results = new Array<InfusionPluginInfo>();
    this.log.debug(`InfusionPluginEnumerator.enumerate()`);
    let names;
    this.fileEnumerator.enumerate(this.pluginPath).forEach((file) => {
      if (file.indexOf('.js') >= 0) {
        let extractor = new InfusionPluginInfoExtractor(this.log);
        results.push(extractor.extract(file, this.fileReader.read(`${this.pluginPath}\\${file}`), req));
      }
    });  
    return results;
  }
  
}