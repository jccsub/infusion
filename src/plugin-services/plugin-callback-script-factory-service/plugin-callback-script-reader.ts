
import * as fs from 'fs';

export class PluginCallbackScriptReader {

  private static  filePath = './plugin-callback-script.txt';

  public static read() : Promise<string> {
    return new Promise<string>( (resolve,reject) => {
      fs.readFile( PluginCallbackScriptReader.filePath , 'utf8', (err,data) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(data);
        }
      } );
    } );
  }

}


/*
var fs = require('fs')
, filename = process.argv[2];
fs.readFile(filename, 'utf8', function(err, data) {
if (err) throw err;
console.log('OK: ' + filename);
console.log(data)
});
*/