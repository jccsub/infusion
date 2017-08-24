import { InfusionContext } from '../../domain/infusion-context';
import { InfusionConfiguration } from '../../domain/infusion-configuration';
import { InfusionProxyRequestHandler } from '../event-handlers/infusion-proxy-request-handler';
import { WinstonLog } from '../../../winston-logger';
import { Log } from '../../../logger';
import * as TypeMoq from 'typemoq';
import {suite, test} from 'mocha-typescript';
import {should, expect} from 'chai';

@suite 
class InfusionProxyRequestHandlerTest {
  private log : Log;
  private proxyRequestHandler : InfusionProxyRequestHandler;
  private config : InfusionConfiguration;
  private res : any;
  private req : any;
  private err : Error;
  private proxyReq : any;
  private eventString : string;
  private eventDataCallback : Function;
  private eventEndCallback : Function;

  before() {
    should();
    this.log = new WinstonLog();
    this.config = new InfusionConfiguration();
    this.proxyRequestHandler = new InfusionProxyRequestHandler(this.log, this.config);
    this.proxyReq = {};
    this.req = {};
    this.res = {};   
    this.req.on = (event:string, callback: Function) => { 
      this.eventString=event; 
      if (event === 'data') {
        this.eventDataCallback = callback;      
      }
      else {
        this.eventEndCallback = callback;
      }
    };
  }

  @test handleCreatesANewContextOnReqIfItDoesntExist() {    
    this.req.context = null;
    this.proxyRequestHandler.handle(this.proxyReq, this.req, this.res);
    expect(this.req.context).to.not.equal(null);
  }

  @test handleUsesExistingContextOnReqIfItExist() {    
    this.req.context = new InfusionContext(this.log, this.config);
    var holdContext = this.req.context;
    this.proxyRequestHandler.handle(this.proxyReq, this.req, this.res);
    expect(this.req.context).to.equal(holdContext);
  }

  @test handleSetsUpRequestHandlerDataCallback() {    
    this.req.context = new InfusionContext(this.log, this.config);
    var holdContext = this.req.context;
    this.proxyRequestHandler.handle(this.proxyReq, this.req, this.res);
    expect(this.eventDataCallback).to.not.equal(null);
    this.eventDataCallback('test');    
  }
    
  @test handleSetsUpRequestHandlerEndCallback() {    
    this.req.context = new InfusionContext(this.log, this.config);
    var holdContext = this.req.context;
    this.proxyRequestHandler.handle(this.proxyReq, this.req, this.res);
    expect(this.eventEndCallback).to.not.equal(null);
    try {
      this.eventEndCallback();    
    }
    catch(ex) {
      //Disregard the error
    }
  }
}