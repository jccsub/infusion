

export class PlaceholderValuePair {
  public placeholder : string;
  public value : string;

  constructor(placeholder : string, value : string) {
    this.placeholder = placeholder;
    this.value = value;
  }
}

export class PluginCallbackScriptFiller {
 
  public static replacePlaceholders(scriptContent : string, placeholderValuePairs : Array<PlaceholderValuePair>) : Promise<string> {
    return new Promise<string>( (resolve) => {
      placeholderValuePairs.forEach((placeholderValuePair) => {
        scriptContent = scriptContent.replace(placeholderValuePair.placeholder, placeholderValuePair.value,);
      });
      resolve(scriptContent);
    } );
  }
  
}