import { Log } from '../../../logger';


export class PathRewriteHandler {

  private log : Log;
  constructor(log : Log) {
    this.log = log;
  }

  
  /* istanbul ignore next */
  public handle(path : string, req : any) {
    //If doing a path rewrite, simply set req.newPath to whatever path should
    //be written.
  }

}