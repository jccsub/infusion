import { generateUid } from '../servicebus';
export class ProxyFactoryRequest {

  public static event = 'proxy.factory.request';
  public readonly rCloudName : string;
  public readonly requestId : string;

  constructor(rcloudName : string) {
    this.requestId = generateUid();
    this.rCloudName = rcloudName;
  }
}

export class ProxyFactoryResponse {
  public static event = 'proxy.factory.response';
  public readonly url : string;
  public readonly requestId : string;

  constructor(requestId : string, url : string) {
    this.url = url;
    this.requestId = requestId;
  }
}