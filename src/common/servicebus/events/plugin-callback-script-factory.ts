import { generateUid } from '../servicebus';
export class PluginCallbackScriptFactoryRequest {
  public static event = 'plugincallbackscript.factory.request';
  public readonly pluginServerUrl : string;
  public readonly requestId : string;

  constructor(pluginServerUrl : string) {
    this.requestId = generateUid();
    this.pluginServerUrl = pluginServerUrl;
  }
}

export class PluginCallbackScriptFactoryResponse {
  public static event = 'plugincallbackscript.factory.response';

  public readonly requestId : string;
  public readonly stub : string;

  constructor(requestId : string, stub : string) {
    this.stub = stub;
    this.requestId = requestId;
  }
}