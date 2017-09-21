import { Log } from '../../logger';
import { Dictionary, DictionaryCallback } from './dictionary';
import * as redis from 'redis';


export class RedisDictionary implements Dictionary{

  private log: Log;
  private redisClient : any;
  constructor(log : Log)  {
    this.log = log;
    this.redisClient = redis.createClient();
  }

  public set(key: string, value: string): Promise<void> {
    return new Promise( (resolve, reject) => {
      this.log.debug(`RedisDictionary.set(${key}, ${value}) ` )
      this.redisClient.set(key,value, (err, reply) => {
        if (!err) {
          this.log.debug(`RedisDictionary.set resolved` )
          resolve();
        }
        else {
          this.log.error(`RedisDictionary.set rejected` )
          reject(err);
        }
      });          
    });
  }

  public get(key: string): Promise<string> {   
    this.log.debug(`RedisDictionary.get(${key}...` );
    return new Promise<string>((resolve, reject) => {
      this.redisClient.get(key, (err, value) => {
        if (!err) {
          this.log.debug('RedisDictionary.get resolved value = ' + value);
          resolve(value);
        }
        else {
          this.log.error('RedisDictionary.get rejected err = ' + JSON.stringify(err));
          reject(err);
        }
      });
    });
  }

  public del(key: string): Promise<void> {
    this.log.debug(`RedisDictionary.del(${key})` );
    return new Promise<void>(
      (resolve,reject) => {
        this.redisClient.del(key,(err,reply) => {
          if (!err) {
            resolve();
          }
          else {
            reject(err);
          }
        });       
    });
  }
}