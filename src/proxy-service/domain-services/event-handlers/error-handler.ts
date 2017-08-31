import { Log } from '../../../logger';

export class ErrorHandler {

  private log : Log;
  constructor(log : Log) {
    this.log = log;
  }
  public handle(err : any, req : any, res : any) {
    res.writeHead(500, {'Content-Type': 'text/plain'});
    res.end(`Something went wrong: ${err}`);
  }

}