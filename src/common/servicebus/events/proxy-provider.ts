import { generateUid } from '../servicebus';
export class ProxyProviderRequest {
  public static event = 'proxy.provider.request';
  public readonly rCloudName : string;
  public readonly requestId : string;

  constructor(rcloudName : string) {
    this.requestId = generateUid();
    this.rCloudName = rcloudName;
  }
}

export class ProxyProviderResponse {
  public static event = 'proxy.provider.response';
  public readonly url : string;
  public readonly requestId : string;

  constructor(requestId : string, url : string) {
    this.url = url;
    this.requestId = requestId;
  }
}