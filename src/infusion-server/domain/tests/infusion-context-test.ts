import { InfusionConfiguration } from '../infusion-configuration';
import { InfusionContext } from '../infusion-context';
import { WinstonLog } from '../../../winston-logger';
import { Log } from '../../../logger';
import * as TypeMoq from 'typemoq';
import {suite, test} from 'mocha-typescript';
import {should} from 'chai';

@suite 
class ProxyContextIsCreated {

  private log : Log;

  private infusionContext : InfusionContext;

  private configuration : InfusionConfiguration;

  before() {
    should();
    this.log = new WinstonLog();
    this.configuration = new InfusionConfiguration();
    this.infusionContext = new InfusionContext(this.log,this.configuration);    
  }

  @test toStringWillPrintInitializedContext() {    
    this.infusionContext.toString();
  }
}