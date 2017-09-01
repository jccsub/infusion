

export class SessionWriterConfiguration {
  public user: string;
  public password : string;
  public server : string;
  public database : string;
  public irrelevantUrlSubstrings : Array<string> = new Array<string>();
  public irrelevantResponseContentTypes : Array<RegExp> = new Array<RegExp>();

  constructor() {
    this.irrelevantResponseContentTypes = [/image.*/];
    this.irrelevantUrlSubstrings = [
      'pingsession',
      'setwindowclosedtime',
      'checksessionisvalid',
      'uscustomstyles'
    ];
  }

}