import {
  InfusionContextMssqlWriter,
  InfusionContextMssqlWriterConfig,
} from '../src/infusion-server/infrastructure/infusion-context-mssql-writer';
import { MarkupModifier } from '../src/infusion-server/application-services/markup-modifier';
import { InfusionModification, InfusionModificationType } from '../src/infusion-server/domain/infusion-modification';
import { InfusionConfiguration } from '../src/infusion-server/domain/infusion-configuration';
import { ProxyService } from '../src/infusion-server/application-services/proxy-service';
import { WinstonLog } from '../src/winston-logger';
import { Log } from '../src/logger';


const port = 8001;
//const target = 'https://httpbin.org/'
const target = 'http://jccsubweb.newgen.corp';

export class OnionTestSetup  {

  private log : Log;

  private proxyService : ProxyService;

  private writer : InfusionContextMssqlWriter;
  private writerConfig : InfusionContextMssqlWriterConfig;

  private configuration : InfusionConfiguration = new InfusionConfiguration();

  private markupModifier : MarkupModifier;
  public startTest() {
    this.log = new WinstonLog();
    this.writerConfig = new InfusionContextMssqlWriterConfig('dev', 'usg', 'localhost', 'usproxy');
    this.writer = new InfusionContextMssqlWriter(this.log,this.writerConfig);
    this.writer.initialize();
    this.configuration.modifications =  [
      //new InfusionModification('h1','<h1>Replaced Title!!</h1>',InfusionModificationType.Replace,/.*/)
    new InfusionModification('body',
//      `<script type="text/javascript">window.addEventListener('load', function() {alert('load');})</script>`,
      `<script type="text/javascript" src="http://127.0.0.1:3000/infusions/firsttest.js"></script>`,
      //../infusions/firsttest.js
      InfusionModificationType.Append,
      /(http?)(\:\/\/)(.*)(\/)(Login)(\.aspx)(.*)/)
    ];
    this.configuration.irrelevantUrlSubstrings = [
      'pingsession',
      'setwindowclosedtime',
      'checksessionisvalid',
      'uscustomstyles'
    ];

    this.configuration.irrelevantResponseContentTypes = [
      /image.*/
    ]


    this.markupModifier = new MarkupModifier(this.log);
    this.proxyService = new ProxyService(this.log, this.markupModifier, this.writer, this.configuration );
    this.proxyService.listen(3000,target, port);
  }

}