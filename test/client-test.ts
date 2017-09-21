import { Log } from '../src/logger';
import * as path from 'path';
import { PortalServer } from "../src/portal/portal-server";


export class ClientTest {

  private log : Log;

  constructor(log : Log) {
    this.log = log;
  }

  public startTest() {
    this.startupPortalServer(3030);
  }

  private startupPortalServer(port: number) {
    let clientPath = path.join(__dirname,'\\..\\..\\dist');
    let portalServer = new PortalServer(this.log, clientPath);
    portalServer.listen(port);
  }
}
