
export class InfusionPluginInfo {

  public readonly  name : string;
  public readonly url : string;
  public readonly urlPattern? : RegExp;

  constructor(name : string, url : string, urlPattern? : RegExp) {
    this.name = name;
    this.url = url;
    this.urlPattern = urlPattern;
  }

}