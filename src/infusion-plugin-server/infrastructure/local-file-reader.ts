import { FileReader } from '../file-reader';
import * as fs from 'fs';



export class LocalFileReader implements FileReader{
  
  public read(path : string) : string {
    return fs.readFileSync(path,"utf8");
  }
}