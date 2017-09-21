
export interface DictionaryCallback {
  (err : any, value : string) : void;
}
export interface Dictionary {
  set(key : string, value : string) : Promise<void>;
  get(key : string) : Promise<string>;
  del(key : string) : Promise<void>;
}