import { InfusionContext } from '../domain/infusion-context';
import { Log } from '../../logger';
import { ModificationQueryFunction } from '../domain/infusion-modification';
import { InfusionConfiguration } from '../domain/infusion-configuration';


export class MarkupModifier {

  private log : Log;

  constructor(log : Log) {
    this.log = log;
  }

  public performModifications(url : string, req, res) {
    this.log.debug('performModifications');
    let context = (req.context as InfusionContext);
    var getProcessorFunction = require('harmon');
    var func = getProcessorFunction([],this.getModificationQueryFunctions(url, context));
    func(req, res, () => {});  
  }

  private getModificationQueryFunctions(url : string, context : InfusionContext) : Array<ModificationQueryFunction> {
    let result = new Array<ModificationQueryFunction>();
    context.config.modifications.forEach((modification) => {
      if (modification.urlPattern.test(url)) {
        result.push(modification.convertToQueryFunction());
      }
      else {
      }
    });
    return result;
  }
 

}