import { Log } from '../../logger';
import { FileReader } from '../file-reader';
import * as fs from 'fs';



export class LocalFileReader implements FileReader{
  
  private log : Log;
  constructor(log : Log) {
    this.log = log;
  }
  public read(path : string) : string {
    return fs.readFileSync(path, "utf8");
  }
}