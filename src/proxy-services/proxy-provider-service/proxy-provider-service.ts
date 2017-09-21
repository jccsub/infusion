import { ProxyProviderRequest, ProxyProviderResponse } from '../../common/servicebus/events/proxy-provider';
import { Dictionary } from '../../common/dictionary/dictionary';
import { ServiceBus } from '../../common/servicebus/servicebus';
import { Log } from '../../logger';
import { ProxyStore } from './proxy-store';
import { Configuration } from '../proxy-service/domain/configuration';


export class ProxyProviderService {
  private configuration : Configuration;
  private log : Log;
  private servicebus : ServiceBus;
  private dictionary : Dictionary;
  
  constructor(log : Log, servicebus : ServiceBus, configuration : Configuration, dictionary : Dictionary) {
    this.log = log;
    this.servicebus = servicebus;
    this.configuration = configuration;
    this.dictionary = dictionary;
  }

  public listen() {
    this.servicebus.listen(ProxyProviderRequest.event,async (request : ProxyProviderRequest) => {
      let proxyStore = new ProxyStore(this.log, this.servicebus, this.dictionary);
      let url = await proxyStore.getProxyServiceForRCloud(request.rCloudName);
      let response = new ProxyProviderResponse(request.requestId, url);
      this.servicebus.send(ProxyProviderResponse.event, response);
    })
  }
   
}