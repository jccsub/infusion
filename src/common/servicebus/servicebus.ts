
export interface ServiceBusListenCallback {
  (message : any) : void;
}

export interface ServiceBus {
  listen(event: string, callback : ServiceBusListenCallback );
  send(event: string, message : any);
  subscribe(event: string, callback : ServiceBusListenCallback);
  publish(event: string, message : any);
}


export function generateUid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}