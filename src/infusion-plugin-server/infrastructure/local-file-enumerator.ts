import * as fs from 'fs';
import { FileEnumerator } from '../file-enumerator';


export class LocalFileEnumerator implements FileEnumerator{
  public enumerate(folder: string): Array<string> {
    let result = new Array<string>();
    fs.readdir(folder, (err, files) => {
      files
        .filter(file => { return file.substr(-3) === '.js'})
        .forEach(file => { result.push(file); });
    })
    return result;
  }
}

