import { Configuration } from '../configuration';
import { Context } from '../context';
import { WinstonLog } from '../../../winston-logger';
import { Log } from '../../../logger';
import * as TypeMoq from 'typemoq';
import {suite, test} from 'mocha-typescript';
import {should} from 'chai';

@suite 
class ProxyContextIsCreated {

  private log : Log;

  private infusionContext : Context;

  private configuration : Configuration;

  before() {
    should();
    this.log = new WinstonLog();
    this.configuration = new Configuration();
    this.infusionContext = new Context(this.log,this.configuration);    
  }

  @test toStringWillPrintInitializedContext() {    
    this.infusionContext.toString();
  }
}