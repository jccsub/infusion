import { Log } from '../../../logger';
import { Context } from '../domain/context';
import { ModificationQueryFunction } from '../domain/modification';
import { Configuration } from '../domain/configuration';


export class MarkupModifier {

  private log : Log;

  constructor(log : Log) {
    this.log = log;
  }

  public performModifications(req, res) {
    this.log.debug('performModifications');
    let context = (req.context as Context);
    var getProcessorFunction = require('harmon');
    var func = getProcessorFunction([],this.getModificationQueryFunctions( context.request.fullUrl, context));
    func(req, res, () => {});  
  }

  private getModificationQueryFunctions(url : string, context : Context) : Array<ModificationQueryFunction> {
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