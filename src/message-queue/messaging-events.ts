export class MessagingEvent {
  public readonly name : string;
  public data : any;

  constructor(eventName : string) {
    this.name = eventName;
  }
}

export namespace Events {
 
  //Format:
  //  <service>.<entity>.<action (past tense)>
  export class proxy {
    public static modifications = {
      request : new MessagingEvent('proxy.modifications.request'),
      response :new MessagingEvent('proxy.modifications.response')
    }
  }

  export class pluginQuery {
    public static plugins = {
      requested : new MessagingEvent('plugin-query.plugins.requested'),
      sent : new MessagingEvent('plugin-query.plugins.received')
    }
  }
}


