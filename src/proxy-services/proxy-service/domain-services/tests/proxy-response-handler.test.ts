import { Log } from '../../../../logger';
import { WinstonLog } from '../../../../winston-logger';
import { Configuration } from '../../domain/configuration';
import { Context } from '../../domain/context';
import { ProxyResponseHandler } from '../event-handlers/proxy-response-handler';
import { PathRewriteHandler } from '../event-handlers/path-rewrite-handler';
import * as TypeMoq from 'typemoq';
import {suite, test} from 'mocha-typescript';
import {should,expect} from 'chai';

@suite 
class InfusionProxyResponseHandlerTest {
  private log : Log;
  private proxyResponseHandler : ProxyResponseHandler;
  private res : any;
  private req : any;
  private err : Error;
  private proxyRes : any;

  private eventString : string;
  private eventDataCallback : Function;
  private eventEndCallback : Function;
  private config : Configuration;

  before() {
    should();
    this.log = new WinstonLog();
    this.proxyResponseHandler = new ProxyResponseHandler(this.log);
    this.proxyRes = { 
      headers: {
        'content-encoding' : 'text'
      }
    };    
    this.req = {};
    this.res = {};   
    this.config = new Configuration();
    this.req.context = new Context(this.log, this.config)
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