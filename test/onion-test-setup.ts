import { SessionWriterService } from '../src/session-services/session-writer-service/session-writer-service';
import { SessionWriterConfiguration } from '../src/session-services/session-writer-service/session-writer-configuration';
import { InfusionModification, InfusionModificationType } from '../src/proxy-services/proxy-service/domain/modification';
import { ProxyFactoryService } from '../src/proxy-services/proxy-factory-service/proxy-factory-service';
import { MarkupModifier } from '../src/proxy-services/proxy-service/application-services/markup-modifier';
import { Configuration } from '../src/proxy-services/proxy-service/domain/configuration';
import { ProxyService } from '../src/proxy-services/proxy-service/application-services/proxy-service';
import { ProxyProviderService } from '../src/proxy-services/proxy-provider-service/proxy-provider-service';
import { LocalFileEnumerator } from '../src/plugin-services/plugin-query-service/infrastructure/local-file-enumerator';
import { PluginInfoExtractor } from '../src/plugin-services/plugin-query-service/plugin-info-extractor';
import { LocalFileReader } from '../src/plugin-services/plugin-query-service/infrastructure/local-file-reader';
import { QueryService } from '../src/plugin-services/plugin-query-service/query-service';
import { ProxyProviderRequest, ProxyProviderResponse } from '../src/common/servicebus/events/proxy-provider';
import { RedisDictionary } from '../src/common/dictionary/redis-dictionary';
import { Dictionary } from '../src/common/dictionary/dictionary';
import { ServiceBus } from '../src/common/servicebus/servicebus';
import { ProxyFactoryRequest, ProxyFactoryResponse} from '../src/common/servicebus/events/proxy-factory';
import { RabbitMqServiceBus } from '../src/common/servicebus/rabbitmq-servicebus';
import { TestService } from '../src/test-service/test-service';
import { PortalServer } from '../src/portal/portal-server';
import * as path from 'path';
import { WinstonLog } from '../src/winston-logger';
import { Log } from '../src/logger';
import * as request from 'request-json';
import { PluginEnumerator } from "../src/plugin-services/plugin-query-service/plugin-enumerator";
import { PluginQuery } from "../src/plugin-services/plugin-query-service/plugin-query";
import { PluginInfo } from "../src/plugin-services/plugin-query-service/plugin-info";
import { PluginUploadService } from "../src/plugin-services/plugin-upload-service/plugin-upload-service";
import { SessionQueryAll } from "../src/session-services/session-query-service/session-query-all";
import { SessionQueryById } from "../src/session-services/session-query-service/session-query-by-id";
import { SessionQueryService } from "../src/session-services/session-query-service/session-query-service";
import { SessionQueryConfiguration } from "../src/session-services/session-query-service/session-query-configuration";

const port = 8001;
const target = 'http://jccsubweb.newgen.corp';

export class OnionTestSetup  {

  private proxyService : ProxyService;
  private configuration : Configuration = new Configuration();
  private markupModifier : MarkupModifier;

  private infusionPluginServer : QueryService;

  private log : Log;
  private servicebus : ServiceBus;
  private proxyDictionary : Dictionary;

  constructor(log : Log) {
    this.log = log;
    this.servicebus = new RabbitMqServiceBus(this.log);
    this.proxyDictionary = new RedisDictionary(this.log);
  }

  public startTest() {
    this.startupSessionWriterService(3001);    
    this.startupProxyFactoryService();
    this.startupInfusionPluginServer(3002);
    this.startupSessionQueryService(3005);
    this.startupPluginUploadService(3006);
    this.startupPortalServer(3007);
    this.startupTestService(3008);
    this.startupProxyProviderService()
  }

  private startupProxyProviderService() {
    let providerService = new ProxyProviderService(this.log, this.servicebus,this.configuration, this.proxyDictionary );
    providerService.listen();

    let sb = new RabbitMqServiceBus(this.log);
    sb.listen(ProxyProviderResponse.event, (response : ProxyProviderResponse) => {
      this.log.warn(`oniontest - received proxy provider response: ${response.url}`);
    });    
    let sb2 = new RabbitMqServiceBus(this.log);
    sb2.send(ProxyProviderRequest.event, new ProxyProviderRequest('jccsub'));
    setTimeout(() => {
      let sb3 = new RabbitMqServiceBus(this.log);
      sb3.listen(ProxyProviderResponse.event, (response : ProxyProviderResponse) => {
        this.log.warn(`oniontest - received proxy provider response: ${response.url}`);
      });    
      sb3.send(ProxyProviderRequest.event, new ProxyProviderRequest('jccsub'));
    },  5000);
  }

  
  private startupProxyFactoryService() {
    this.configuration.modifications =  this.getModifications();   
    let proxyFactory = new ProxyFactoryService (this.log, new RabbitMqServiceBus(this.log), this.configuration); 
    proxyFactory.listen();       
   }

  private startupTestService(port : number) {
    let clientPath = '\\..\\..\\src\\test-service';
    new TestService(this.log, clientPath).listen(port);

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


  private startupPortalServer(port: number) {
    let clientPath = path.join(__dirname,'\\..\\..\\dist');
    let portalServer = new PortalServer(this.log, clientPath);
    portalServer.listen(port);
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