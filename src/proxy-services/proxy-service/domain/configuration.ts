import { InfusionModification } from './modification';



export class Configuration {

  constructor() {

  }
  
  public modifications : Array<InfusionModification>;
  public irrelevantUrlSubstrings : Array<string>;
  public irrelevantResponseContentTypes : Array<RegExp>;

}