import { InfusionModification } from './infusion-modification';



export class InfusionConfiguration {

  constructor() {

  }
  
  public modifications : Array<InfusionModification>;
  public irrelevantUrlSubstrings : Array<string>;
  public irrelevantResponseContentTypes : Array<RegExp>;

}