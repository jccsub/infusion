"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const infusion_context_mssql_writer_1 = require("../src/infusion-server/infrastructure/infusion-context-mssql-writer");
const markup_modifier_1 = require("../src/infusion-server/application-services/markup-modifier");
const infusion_modification_1 = require("../src/infusion-server/domain/infusion-modification");
const infusion_configuration_1 = require("../src/infusion-server/domain/infusion-configuration");
const proxy_service_1 = require("../src/infusion-server/application-services/proxy-service");
const winston_logger_1 = require("../src/winston-logger");
const port = 8001;
//const target = 'https://httpbin.org/'
const target = 'http://jccsubweb.newgen.corp';
class OnionTestSetup {
    constructor() {
        this.configuration = new infusion_configuration_1.InfusionConfiguration();
    }
    startTest() {
        this.log = new winston_logger_1.WinstonLog();
        this.writerConfig = new infusion_context_mssql_writer_1.InfusionContextMssqlWriterConfig('dev', 'usg', 'localhost', 'usproxy');
        this.writer = new infusion_context_mssql_writer_1.InfusionContextMssqlWriter(this.log, this.writerConfig);
        this.writer.initialize();
        this.configuration.modifications = [
            //new InfusionModification('h1','<h1>Replaced Title!!</h1>',InfusionModificationType.Replace,/.*/)
            new infusion_modification_1.InfusionModification('body', 
            //      `<script type="text/javascript">window.addEventListener('load', function() {alert('load');})</script>`,
            `<script type="text/javascript" src="http://127.0.0.1:3000/infusions/firsttest.js"></script>`, 
            //../infusions/firsttest.js
            infusion_modification_1.InfusionModificationType.Append, /(http?)(\:\/\/)(.*)(\/)(Login)(\.aspx)(.*)/)
        ];
        this.configuration.irrelevantUrlSubstrings = [
            'pingsession',
            'setwindowclosedtime',
            'checksessionisvalid',
            'uscustomstyles'
        ];
        this.configuration.irrelevantResponseContentTypes = [
            /image.*/
        ];
        this.markupModifier = new markup_modifier_1.MarkupModifier(this.log);
        this.proxyService = new proxy_service_1.ProxyService(this.log, this.markupModifier, this.writer, this.configuration);
        this.proxyService.listen(3000, target, port);
    }
}
exports.OnionTestSetup = OnionTestSetup;
