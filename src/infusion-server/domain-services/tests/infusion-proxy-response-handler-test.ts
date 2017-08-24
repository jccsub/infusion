import { InfusionConfiguration } from '../../domain/infusion-configuration';
import { InfusionContext } from '../../domain/infusion-context';
import { InfusionProxyResponseHandler } from '../event-handlers/infusion-proxy-response-handler';
import { InfusionPathRewriteHandler } from '../event-handlers/infusion-path-rewrite-handler';
import { WinstonLog } from '../../../winston-logger';
import { Log } from '../../../logger';
import * as TypeMoq from 'typemoq';
import {suite, test} from 'mocha-typescript';
import {should,expect} from 'chai';

@suite 
class InfusionProxyResponseHandlerTest {
  private log : Log;
  private proxyResponseHandler : InfusionProxyResponseHandler;
  private res : any;
  private req : any;
  private err : Error;
  private proxyRes : any;

  private eventString : string;
  private eventDataCallback : Function;
  private eventEndCallback : Function;
  private config : InfusionConfiguration;

  before() {
    should();
    this.log = new WinstonLog();
    this.proxyResponseHandler = new InfusionProxyResponseHandler(this.log);
    this.proxyRes = { 
      headers: {
        'content-encoding' : 'text'
      }
    };    
    this.req = {};
    this.res = {};   
    this.config = new InfusionConfiguration();
    this.req.context = new InfusionContext(this.log, this.config)
    this.proxyRes.on = (event:string, callback: Function) => { 
      this.eventString=event; 
      if (event === 'data') {
        this.eventDataCallback = callback;      
      }
      else {
        this.eventEndCallback = callback;
      }
    };    
  }

  @test handleThrowsExceptionIfContextDoesNotExist() {    
    this.req.context = null;
    let exception = false;
    try {
      this.proxyResponseHandler.handle(this.proxyRes, this.req, this.res);
    }
    catch(ex) {
      exception = true;
    }
    exception.should.equal(true);
  }
  
  @test handleSetsUpResponseHandlerDataCallback() {    
    this.proxyResponseHandler.handle(this.proxyRes, this.req, this.res);
    expect(this.eventDataCallback).to.not.equal(null);
    this.eventDataCallback('test');    
  }
    
  @test handleSetsUpResponseHandlerEndCallback() {    
    this.proxyResponseHandler.handle(this.proxyRes, this.req, this.res);
    expect(this.eventEndCallback).to.not.equal(null);
    this.eventEndCallback();    
  }


}