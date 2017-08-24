import { InfusionModification, InfusionModificationType } from '../../domain/infusion-modification';
import { MarkupModifier } from '../markup-modifier';
import { InfusionConfiguration } from '../../domain/infusion-configuration';
import { InfusionContext } from '../../domain/infusion-context';
import { WinstonLog } from '../../../winston-logger';
import { Log } from '../../../logger';
import * as TypeMoq from 'typemoq';
import {suite, test} from 'mocha-typescript';
import {should} from 'chai';

@suite 
class MarkupModifierTest {

  private log : Log;

  private infusionContext : InfusionContext;
  private configuration : InfusionConfiguration;
  private markupModifier : MarkupModifier;
  private req : any;
  private res : any;
  private url : string;

  before() {
    should();
    this.log = new WinstonLog();
    this.configuration = new InfusionConfiguration();
    this.infusionContext = new InfusionContext(this.log, this.configuration);
    this.markupModifier = new MarkupModifier(this.log);
    this.req = process.stdout;
    this.res = process.stdin
    this.req.context = this.infusionContext;
    this.url = 'http://123.4.5.6/test';
  }

  @test
  testModificationsToReplace() {
    this.setupContextToReplace();    
    this.markupModifier.performModifications(this.url, this.req, this.res);
  }

  @test
  testModificationsToAppend() {
    this.setupContextToAppend();
    this.markupModifier.performModifications(this.url, this.req, this.res);
  }

  private setupContextToReplace() {
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

