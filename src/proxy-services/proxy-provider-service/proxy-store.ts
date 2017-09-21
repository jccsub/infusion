import { ProxyFactoryRequest, ProxyFactoryResponse } from '../../common/servicebus/events/proxy-factory';
import { ServiceBus } from '../../common/servicebus/servicebus';
import { Log } from '../../logger';
import { Dictionary } from '../../common/dictionary/dictionary';
import { UrlGenerator } from '../proxy-factory-service/url-generator';
import * as request from 'request';
import * as urlExists from 'url-exists';

export class ProxyStore {
  
  private dictionary : Dictionary;
  private log : Log;
  private servicebus : ServiceBus;
  
  constructor(log : Log, servicebus : ServiceBus,  dictionary : Dictionary) {
    this.dictionary  = dictionary;
    this.servicebus = servicebus;
    this.log = log;
  }

  public async getProxyServiceForRCloud(rcloudName : string): Promise<string>{
    this.log.warn('proxy-store - getProxyServiceForRCloud')    
    return this.getExistingProxyService(rcloudName).then( (url) => {
      this.log.warn('proxy-store - getProxyServiceForRCloud - returned from getExistingProxyService');
      if (url.length > 0) 
        return new Promise<string>((resolve) => {
          this.log.warn('proxy-store - getProxyServiceForRCloud - resolving with url: ' + url) ;
          resolve(url)
        });
      return new Promise<string>((resolve) => {
        this.log.warn('proxy-store - getProxyServiceForRCloud - gonna try to get new proxy service') ;
        let request = new ProxyFactoryRequest(rcloudName);
        this.servicebus.listen(ProxyFactoryResponse.event, (response : ProxyFactoryResponse) => {          
          this.log.warn('proxy-store - getProxyServiceForRCloud - received url from ProxyFactory : ' + response.url) ;          
          this.dictionary.set(rcloudName, response.url).then(()=> {resolve(response.url);});         
        });
        this.log.warn('proxy-store - getProxyServiceForRCloud - sending request to ProxyFactory') ;                  
        this.servicebus.send(ProxyFactoryRequest.event, request);
      });
    })
  }

  private async getExistingProxyService(rcloudName : string) {
    this.log.warn('proxy-store - getExistingProxyService')
    let rCloudUrl = await this.dictionary.get(rcloudName);
    this.log.warn('proxy-store - getExistingProxyService - retrieved existing url: ' + rCloudUrl);
    return new Promise<string>( (resolve) => {
      this.validateUrl(rCloudUrl).then((isValid) => {
        if (isValid) {
          this.log.warn('proxy-store - getExistingProxyService - resolving with ' + rCloudUrl);
          resolve(rCloudUrl);
        }
        else {
          this.log.warn('proxy-store - getExistingProxyService - removing invalid entry : ' + rcloudName);
          this.dictionary.del(rcloudName).then(() => {
            this.log.warn('proxy-store - getExistingProxyService - resolving with empty url');
            resolve('');
          });
        }
      })
    });
  }

  private async validateUrl(url : string) : Promise<boolean> {
    this.log.warn('proxy-store - validateUrl - ' + url);
    return new Promise<boolean>((resolve, reject) => {
      urlExists(url, (err, exists) => {        
          this.log.warn(`exists = ${exists}`);
          resolve(exists);
      });
    });
  }


}