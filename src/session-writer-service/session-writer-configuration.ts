

export class SessionWriterConfiguration {
  public readonly user: string;
  public readonly password : string;
  public readonly server : string;
  public readonly database : string;
  public irrelevantUrlSubstrings : Array<string> = new Array<string>();
  public irrelevantResponseContentTypes : Array<RegExp> = new Array<RegExp>();

  constructor(user : string, password : string, server : string, database : string) {
    this.irrelevantResponseContentTypes = [/image.*/];
    this.irrelevantUrlSubstrings = [
      'pingsession',
      'setwindowclosedtime',
      'checksessionisvalid',
      'uscustomstyles'
    ];
    this.user = user;
    this.password = password;
    this.server = server;
    this.database = database;
  }

}