import { InfusionPluginInfo } from './infusion-plugin-info';

export class InfusionPluginInfoExtractor {

  private readonly pluginNameLabel = 'PLUGIN.NAME=';
  private readonly pluginUrlPatternLabel = 'PLUGIN.URLPATTERN=';
  public extract(pluginContent : string) : InfusionPluginInfo {    
    let lines = pluginContent.split('\n');
    var name : string = '';
    let pattern : RegExp | undefined;
    var pos : number;
    let found = false;

    lines.some((line) => {
      pos = line.indexOf(this.pluginNameLabel);
      if (pos >= 0) {
        name = line.substr(pos + this.pluginNameLabel.length);
        found = true;
      }
      else {
        pos = line.indexOf(this.pluginUrlPatternLabel);
        if (pos >= 0) {
          pattern = new RegExp(line.substr(pos + this.pluginUrlPatternLabel.length));
          //as soon as you find the url pattern, you're done so exit out of there https://stackoverflow.com/a/2641374          
          return true;
        }
      }
      return false;
    });

    if (found) {
      throw new Error('Found plugin name label but not url pattern');
    }
    
    return new InfusionPluginInfo(name, '', pattern);
    
    
  }


}