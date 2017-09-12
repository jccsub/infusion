import { PluginUploadService } from '../src/plugin-upload-service/plugin-upload-service';
import { SessionQueryById } from '../src/session-query-service/session-query-by-id';
import { SessionQueryConfiguration } from '../src/session-query-service/session-query-configuration';
import { SessionQueryAll } from '../src/session-query-service/session-query-all';
import { SessionQueryService } from '../src/session-query-service/session-query-service';
import { AutomatedHtmlService } from '../src/automated-html-service/auto-html-service';
import { PluginInfo } from '../src/plugin-query-service/plugin-info';
import { PluginInfoExtractor } from '../src/plugin-query-service/plugin-info-extractor';
import { PluginQuery } from '../src/plugin-query-service/plugin-query';
import * as path from 'path';
import { PluginEnumerator } from '../src/plugin-query-service/plugin-enumerator';
import { LocalFileReader } from '../src/plugin-query-service/infrastructure/local-file-reader';
import { LocalFileEnumerator } from '../src/plugin-query-service/infrastructure/local-file-enumerator';
import { QueryService } from '../src/plugin-query-service/query-service';
import { SessionWriterService } from '../src/session-writer-service/session-writer-service';
import { SessionWriterConfiguration } from '../src/session-writer-service/session-writer-configuration';
import { SessionWriter } from '../src/session-writer-service/session-writer';
import { Context } from '../src/proxy-service/domain/context';
import { MarkupModifier } from '../src/proxy-service/application-services/markup-modifier';
import { InfusionModification, InfusionModificationType } from '../src/proxy-service/domain/modification';
import { Configuration } from '../src/proxy-service/domain/configuration';
import { ProxyService } from '../src/proxy-service/application-services/service';
import { WinstonLog } from '../src/winston-logger';
import { Log } from '../src/logger';
import * as request from 'request-json';

const port = 8001;
const target = 'http://jccsubweb.newgen.corp';

export class OnionTestSetup  {
  private log : Log;
  private proxyService : ProxyService;
  private configuration : Configuration = new Configuration();
  private markupModifier : MarkupModifier;

  private infusionPluginServer : QueryService;
  public startTest() {
    this.log = new WinstonLog();
    this.startupSessionWriterService(3001);    
    this.startupProxyService(3000,3001);
    this.startupInfusionPluginServer(3002);
    this.startupAutomatedXmlService(3004);
    this.startupSessionQueryService(3005);
    this.startupPluginUploadService(3006);
  }

  private startupProxyService(port : number, sessionWriterPort : number) {
    this.configuration.modifications =  this.getModifications();   
    this.markupModifier = new MarkupModifier(this.log);
    this.proxyService = new ProxyService(this.log, this.markupModifier, this.configuration );
    let clientToSessionWriter = request.createClient(`http://localhost:${sessionWriterPort}`)

    /*
    this.proxyService.on('infusionResponse',(context : Context) => {
      clientToSessionWriter.post('/', context.flatten(), (err, res, body) => {
      });
    });
*/
    this.proxyService.listen(3000,target, port);
  }

  private startupSessionWriterService(port : number) {
    let writerConfig = new SessionWriterConfiguration('dev','usg', 'localhost','usproxy');
    new SessionWriterService(this.log,writerConfig).listen(port);
  }

  private startupInfusionPluginServer(port : number) {
    let pluginPath = path.join(__dirname, '\\..\\..\\infusions');
    let pluginEnumerator = new PluginEnumerator(
      this.log,
      new PluginInfoExtractor(this.log,new LocalFileReader(this.log)),  
      new LocalFileEnumerator(this.log), 
      pluginPath);
    let pluginQuery = new PluginQuery(this.log, pluginEnumerator);
    this.infusionPluginServer =  new QueryService(this.log,'http://127.0.0.1',pluginPath,pluginEnumerator, pluginQuery);
    this.infusionPluginServer.on('pluginsForUrl',(plugins : Array<PluginInfo>) => {
      let automateHtmlClient = request.createClient('http://127.0.0.1:3004');
      automateHtmlClient.post('/', plugins, (err, res, body) => {        
        this.log.debug(`body-${body}`);
      })
    });
    this.infusionPluginServer.listen(3002);

  }

  private startupAutomatedXmlService(port : number) {
    let automatedHtml = new AutomatedHtmlService(this.log);
    automatedHtml.listen(port)
    
  }

  private startupSessionQueryService(port: number) {
    let sessionQueryConfig = new SessionQueryConfiguration('dev','usg', 'localhost', 'usproxy');
    let sessionQueryAll = new SessionQueryAll(this.log, sessionQueryConfig);
    let sessionQueryById = new SessionQueryById(this.log, sessionQueryConfig);
    let sessionQueryService = new SessionQueryService(this.log, sessionQueryAll,sessionQueryById);
    sessionQueryService.listen(port)
  }

  private startupPluginUploadService(port: number) {
    let uploadService = new PluginUploadService(this.log);
    uploadService.listen(port);
  }

  private getModifications() : Array<InfusionModification> {
    return [
      new InfusionModification('body',
        `<script type="text/javascript" src="http://127.0.0.1:3002/callback.js"></script>`,
        InfusionModificationType.Append,
        /(http?)(\:\/\/)(.*)(\/)(Login)(\.aspx)(.*)/)
      ];
  }

}