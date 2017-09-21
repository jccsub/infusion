import { WinstonLog } from '../../../../winston-logger';
import { Log } from '../../../../logger';
import { ErrorHandler } from '../event-handlers/error-handler';
import * as TypeMoq from 'typemoq';
import {suite, test} from 'mocha-typescript';
import {should} from 'chai';

@suite 
class InfusionErrorHandlerTest {

  private log : Log;

  private errorHandler : ErrorHandler;

  private res : any;
  private req : any;
  private err : Error;

  before() {
    should();
    this.log = new WinstonLog();
    this.errorHandler = new ErrorHandler(this.log);
    this.err= new Error('Just testing');
    this.req = {};
    this.res = {};   
  }

  @test responseHeaderIsWritten() {    
    var testStatusCode : number = 0;
    var testContentType : object = {};
    this.res.end = (placeHolder) => {};
    this.res.writeHead = (statusCode, contentType) => {
      testStatusCode = statusCode; 
      testContentType = contentType;
    };
    this.errorHandler.handle(this.err, this.req, this.res);
    testStatusCode.should.equal(500);
    testContentType['Content-Type'].should.equal('text/plain');
  }
}