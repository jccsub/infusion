import { InfusionModification, InfusionModificationType } from './modification';


export class Plugin {
  public readonly sourceUrl : string;
  public readonly urlPattern : RegExp;
  public readonly name : string;
  
  constructor(name: string, sourceUrl : string, urlPattern : RegExp) {
    this.sourceUrl = sourceUrl;
    this.urlPattern = urlPattern;
    this.name = name;
  }

  public createModification() : InfusionModification {
    let newMarkup = `<script type="text/javascript" src="${this.sourceUrl}"></script>`;
    return new InfusionModification('body', newMarkup,  InfusionModificationType.Append, this.urlPattern);
  }
}