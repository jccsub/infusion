
export class SessionQueryConfiguration {
  public readonly user: string;
  public readonly password : string;
  public readonly server : string;
  public readonly database : string;

  constructor(user : string, password : string, server : string, database : string) {
    this.user = user;
    this.password = password;
    this.server = server;
    this.database = database;
  }

}