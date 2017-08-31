
export class InfusionPluginInfo {

  public readonly  name : string;
  public readonly url : string;
  public readonly urlPattern : string;

  constructor(name : string, url : string, urlPattern : string) {
    this.name = name;
    this.url = url;
    this.urlPattern = urlPattern;
  }

}