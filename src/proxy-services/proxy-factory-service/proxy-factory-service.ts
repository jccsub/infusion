import { ProxyFactoryRequest, ProxyFactoryResponse } from '../../common/servicebus/events/proxy-factory';
import { ServiceBus } from '../../common/servicebus/servicebus';
import { Log } from '../../logger';
import { UrlGenerator } from './url-generator';
import * as http from 'http';
import { Configuration } from '../proxy-service/domain/configuration';
import { MarkupModifier } from '../proxy-service/application-services/markup-modifier';
import { RANDOM_UNUSED_PORT, ProxyService } from '../proxy-service/application-services/proxy-service';
import * as os from 'os';

export class ProxyFactoryService {
  private configuration : Configuration;
  private log : Log;
  private servicebus : ServiceBus;
  
  constructor(log : Log, servicebus : ServiceBus, configuration : Configuration) {
    this.log = log;
    this.servicebus = servicebus;
    this.configuration = configuration;
  }

  public listen() {
    this.servicebus.listen(ProxyFactoryRequest.event,async (request : ProxyFactoryRequest) => {
      let markupModifier = new MarkupModifier(this.log);
      let proxyServer = new ProxyService(this.log, markupModifier, this.configuration);
      let port = await proxyServer.listen(UrlGenerator.generateUrl(request.rCloudName), 0);
      let newProxyServerUrl = `http://${os.hostname()}:${port}`;
      this.servicebus.send(ProxyFactoryResponse.event, new ProxyFactoryResponse(request.requestId, newProxyServerUrl));
    })
  }
   
}