import { InfusionPluginInfoExtractor } from './infusion-plugin-info-extractor';
import { FileReader } from './file-reader';
import { FileEnumerator } from './file-enumerator';
import { InfusionPluginInfo } from './infusion-plugin-info';


export class InfusionPluginEnumerator {

  private fileEnumerator : FileEnumerator;
  private fileReader  : FileReader;
  constructor(fileEnumerator : FileEnumerator, fileReader : FileReader) {
    this.fileEnumerator = fileEnumerator;
    this.fileReader = fileReader;
  }

  public enumerate() : Array<InfusionPluginInfo> {
    let results = new Array<InfusionPluginInfo>();
    this.fileEnumerator.enumerate('./plugins').forEach((file) => {
      let content = this.fileReader.read(file);
      let info = new InfusionPluginInfoExtractor().extract(content);
      results.push(info);
    });
    return results;
  }
}