import { Log } from '../../../../logger';
import { WinstonLog } from '../../../../winston-logger';
import { InfusionModification, InfusionModificationType } from '../../domain/modification';
import { MarkupModifier } from '../markup-modifier';
import { Configuration } from '../../domain/configuration';
import { Context } from '../../domain/context';
import * as TypeMoq from 'typemoq';
import {suite, test} from 'mocha-typescript';
import {should} from 'chai';

@suite 
class MarkupModifierTest {

  private log : Log;

  private infusionContext : Context;
  private configuration : Configuration;
  private markupModifier : MarkupModifier;
  private req : any;
  private res : any;
  private url : string;

  before() {
    should();
    this.log = new WinstonLog();
    this.configuration = new Configuration();
    this.infusionContext = new Context(this.log, this.configuration);
    this.markupModifier = new MarkupModifier(this.log);
    this.req = process.stdout;
    this.res = process.stdin
    this.req.context = this.infusionContext;
    this.url = 'http://123.4.5.6/test';
  }

  @test
  testModificationsToReplace() {
    this.setupContextToReplace();    
    this.markupModifier.performModifications(this.req, this.res);
  }

  @test
  testModificationsToAppend() {
    this.setupContextToAppend();
    this.markupModifier.performModifications( this.req, this.res);
  }

  private setupContextToReplace() {
    this.infusionContext.request.host = '127.0.0.1';
    this.infusionContext.request.protocol = 'http';
    this.infusionContext.config.modifications = [
    new InfusionModification('h1', '<h1>Applied</h1>',InfusionModificationType.Replace,/test/),
    new InfusionModification('h1', '<h1>NotApplied</h1>',InfusionModificationType.Replace,/notfound/),
    ];
  }

  private setupContextToAppend() {
    this.infusionContext.config.modifications = [
    new InfusionModification('h1', '<h1>Applied</h1>',InfusionModificationType.Append,/test/),
    new InfusionModification('h1', '<h1>NotApplied</h1>',InfusionModificationType.Append,/notfound/),

    ];
  }
  
}

