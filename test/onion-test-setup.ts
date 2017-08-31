import * as path from 'path';
import { InfusionPluginEnumerator } from '../src/infusion-plugin-server/infusion-plugin-enumerator';
import { LocalFileReader } from '../src/infusion-plugin-server/infrastructure/local-file-reader';
import { LocalFileEnumerator } from '../src/infusion-plugin-server/infrastructure/local-file-enumerator';
import { InfusionPluginServer } from '../src/infusion-plugin-server/infusion-plugin-server';
import { SessionWriterService } from '../src/session-writer/session-writer-service';
import { SessionWriterConfiguration } from '../src/session-writer/session-writer-configuration';
import { SessionWriter } from '../src/session-writer/session-writer';
import { InfusionContext } from '../src/infusion-server/domain/infusion-context';
import { MarkupModifier } from '../src/infusion-server/application-services/markup-modifier';
import { InfusionModification, InfusionModificationType } from '../src/infusion-server/domain/infusion-modification';
import { InfusionConfiguration } from '../src/infusion-server/domain/infusion-configuration';
import { ProxyService } from '../src/infusion-server/application-services/proxy-service';
import { WinstonLog } from '../src/winston-logger';
import { Log } from '../src/logger';
import * as request from 'request-json';

const port = 8001;
const target = 'http://jccsubweb.newgen.corp';

export class OnionTestSetup  {
  private log : Log;
  private proxyService : ProxyService;
  private configuration : InfusionConfiguration = new InfusionConfiguration();
  private markupModifier : MarkupModifier;

  private infusionPluginServer : InfusionPluginServer;
  private writerConfig : SessionWriterConfiguration;
  public startTest() {
    this.log = new WinstonLog();
    this.writerConfig = new SessionWriterConfiguration();
    this.writerConfig.database = 'usproxy';
    this.writerConfig.password = 'usg';
    this.writerConfig.user = 'dev';
    this.writerConfig.server = 'localhost';
    new SessionWriterService(this.log,this.writerConfig).listen(3001);
    this.configuration.modifications =  this.getModifications();   
    this.markupModifier = new MarkupModifier(this.log);
    this.proxyService = new ProxyService(this.log, this.markupModifier, this.configuration );
    let clientToSessionWriter = request.createClient('http://localhost:3001')
    this.proxyService.on('infusionResponse',(context : InfusionContext) => {
      clientToSessionWriter.post('/', context.flatten(), (err, res, body) => {
      });
    });
    this.proxyService.listen(3000,target, port);
    let pluginPath = path.join(__dirname, '\\..\\..\\infusions');
    let pluginEnumerator = new InfusionPluginEnumerator(this.log, new LocalFileEnumerator(this.log), new LocalFileReader(this.log),pluginPath);
    this.infusionPluginServer =  new InfusionPluginServer(this.log,'http://127.0.0.1',pluginPath,pluginEnumerator);
    this.infusionPluginServer.listen(3002);
  }

  private getModifications() : Array<InfusionModification> {
    return [
      new InfusionModification('body',
        `<script type="text/javascript" src="http://127.0.0.1:3002/hw_bundle.js"></script>`,
        InfusionModificationType.Append,
        /(http?)(\:\/\/)(.*)(\/)(Login)(\.aspx)(.*)/)
      ];
  }

}