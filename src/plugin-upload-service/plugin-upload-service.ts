import { Log } from '../logger';
import * as express from 'express';
import * as formidable from 'formidable';
import * as fs from 'fs';

export class PluginUploadService {

  private app : any;
  private log : Log;

  constructor(log : Log) {   
    this.log = log;
    this.app = express();
  }

  public listen(port : number)  {    
    this.app.post('/fileupload',(req,res) => {
      if (req.url == '/fileupload') {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
          var oldpath = files.filetoupload.path;
          var newpath = 'C:/Users/chadc/Documents/test/' + files.filetoupload.name;
          fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;
            res.write('File uploaded and moved!');
            res.end();
          });
        });
      } 
    });
    this.app.get('/',(req, res) => {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
        res.write('<input type="file" name="filetoupload"><br>');
        res.write('<input type="submit">');
        res.write('</form>');      
      return res.end();
    });    
    this.app.listen(port);
    this.log.info(`PluginUploadService listening on port ${port}`);   
  }
  
}