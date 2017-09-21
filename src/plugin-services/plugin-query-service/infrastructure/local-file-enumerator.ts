import { Log } from '../../../logger';
import * as path from 'path';
import * as fs from 'fs';
import { FileEnumerator } from '../file-enumerator';


export class LocalFileEnumerator implements FileEnumerator{
  private log : Log;

  constructor(log : Log) {
    this.log = log;
  }

  public enumerate(folder: string) : Array<string>{
    return fs.readdirSync(folder);
  }
}

