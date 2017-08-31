import { Configuration } from '../../domain/configuration';
import { Context } from '../../domain/context';
import { ResponseHandler } from '../event-handlers/response-handler';
import { PathRewriteHandler } from '../event-handlers/path-rewrite-handler';
import { WinstonLog } from '../../../winston-logger';
import { Log } from '../../../logger';
import * as TypeMoq from 'typemoq';
import {suite, test} from 'mocha-typescript';
import {should} from 'chai';

@suite 
class InfusionResponseHandlerTest {
  private log : Log;
  private responseHandler : ResponseHandler;
  private res : any;
  private req : any;
  private err : Error;
  private proxyRes : any;
  private config : Configuration;
  private context : Context;

  before() {
    should();
    this.log = new WinstonLog();
    this.req = {};
    this.res = {};   
    this.proxyRes = {};
    this.config = new Configuration();
    this.context = new Context(this.log, this.config);
    this.responseHandler = new ResponseHandler(this.log, this.context, this.proxyRes, this.res);
  }

  @test test() {    
    
  }
}