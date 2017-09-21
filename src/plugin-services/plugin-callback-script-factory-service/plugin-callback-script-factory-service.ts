import { PluginCallbackScriptReader } from './plugin-callback-script-reader';
import {
  PluginCallbackScriptFactoryRequest,
  PluginCallbackScriptFactoryResponse,
} from '../../common/servicebus/events/plugin-callback-script-factory';

import { PlaceholderValuePair, PluginCallbackScriptFiller } from "./plugin-callback-script-filler";
import { Log } from "../../logger";
import { ServiceBus } from "../../common/servicebus/servicebus";

export class PluginCallbackScriptFactoryService {

  private app : any;

  private log : Log;
  private servicebus : ServiceBus;

  constructor(log : Log, servicebus : ServiceBus) {
    this.log = log;
    this.servicebus = servicebus;
  }

  public listen() {
    this.servicebus.listen(PluginCallbackScriptFactoryRequest.event,async (request : PluginCallbackScriptFactoryRequest) => {
      let content = await PluginCallbackScriptReader.read();
      let replacePluginUrl = new PlaceholderValuePair('[[PluginServiceUrl]]', request.pluginServerUrl);
      content = await PluginCallbackScriptFiller.replacePlaceholders(content,[replacePluginUrl] )
      let response = new PluginCallbackScriptFactoryResponse(request.requestId, content);
      this.servicebus.send(PluginCallbackScriptFactoryResponse.event, response);
    })
  }
  
  

}