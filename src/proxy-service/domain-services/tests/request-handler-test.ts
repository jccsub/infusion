import { RequestHandler } from '../event-handlers/request-handler';
import { Configuration } from '../../domain/configuration';
import { Context } from '../../domain/context';
import { WinstonLog } from '../../../winston-logger';
import { Log } from '../../../logger';
import * as TypeMoq from 'typemoq';
import {suite, test} from 'mocha-typescript';
import {should} from 'chai';

@suite 
class InfusionRequestHandlerTest {
  private log : Log;
  private requestHandler : RequestHandler;
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
    this.req.headers = {};
    this.req.headers.host = '';
    this.req.connection = {};
    this.req.connection.encrypted = false;
    this.res = {};   
    this.proxyRes = {};
    this.config = new Configuration();
    this.context = new Context(this.log, this.config);
    this.requestHandler = new RequestHandler(this.log, this.req, this.context );
  }

  @test onDataAppendsToTheRequestBody() {    
    this.context.request.body = '';
    this.requestHandler.onData('test1');
    this.requestHandler.onData('23');
    this.context.request.body.should.equal('test123');
  }

  @test onEndSetsTheRequestProperties() {
    this.req.url = 'test';
    this.req.headers.host = 'host';
    this.req.method = 'GET';
    this.requestHandler.onEnd();
    this.context.request.url.should.equal('test');
    this.context.request.host.should.equal('host');
    this.context.request.protocol.should.equal('http');
    this.context.request.method = 'GET';
  }

  @test onEndSetsTheProtocolToHttpsIfEncrypted() {
    this.req.connection.encrypted = true;
    this.requestHandler.onEnd();
    this.context.request.protocol.should.equal('https');
  }

  @test onEndGetsTheAspNetSession() {
    this.req.headers.cookie = 'cookie1=1234;ASP.NET_SessionId=5678';
    this.requestHandler.onEnd();
    this.context.request.sessionId.should.equal('5678');
  }
}