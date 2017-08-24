import { InfusionConfiguration } from '../../domain/infusion-configuration';
import { InfusionContext } from '../../domain/infusion-context';
import { InfusionResponseHandler } from '../event-handlers/infusion-response-handler';
import { InfusionPathRewriteHandler } from '../event-handlers/infusion-path-rewrite-handler';
import { WinstonLog } from '../../../winston-logger';
import { Log } from '../../../logger';
import * as TypeMoq from 'typemoq';
import {suite, test} from 'mocha-typescript';
import {should} from 'chai';

@suite 
class InfusionResponseHandlerTest {
  private log : Log;
  private responseHandler : InfusionResponseHandler;
  private res : any;
  private req : any;
  private err : Error;
  private proxyRes : any;
  private config : InfusionConfiguration;
  private context : InfusionContext;

  before() {
    should();
    this.log = new WinstonLog();
    this.req = {};
    this.res = {};   
    this.proxyRes = {};
    this.config = new InfusionConfiguration();
    this.context = new InfusionContext(this.log, this.config);
    this.responseHandler = new InfusionResponseHandler(this.log, this.context, this.proxyRes, this.res);
  }

  @test test() {    
    
  }
}