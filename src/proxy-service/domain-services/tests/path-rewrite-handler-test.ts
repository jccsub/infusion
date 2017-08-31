import { PathRewriteHandler } from '../event-handlers/path-rewrite-handler';
import { WinstonLog } from '../../../winston-logger';
import { Log } from '../../../logger';
import * as TypeMoq from 'typemoq';
import {suite, test} from 'mocha-typescript';
import {should} from 'chai';

@suite 
class InfusionPathRewriteHandlerTest {
  private log : Log;
  private pathRewriteHandler : PathRewriteHandler;
  private res : any;
  private req : any;
  private err : Error;

  before() {
    should();
    this.log = new WinstonLog();
    this.pathRewriteHandler = new PathRewriteHandler(this.log);
    this.req = {};
    this.res = {};   
  }

  @test test() {    
    this.pathRewriteHandler.handle('', this.req);
  }
}