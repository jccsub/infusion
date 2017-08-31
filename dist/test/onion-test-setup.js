"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const infusion_plugin_enumerator_1 = require("../src/infusion-plugin-server/infusion-plugin-enumerator");
const local_file_reader_1 = require("../src/infusion-plugin-server/infrastructure/local-file-reader");
const local_file_enumerator_1 = require("../src/infusion-plugin-server/infrastructure/local-file-enumerator");
const infusion_plugin_server_1 = require("../src/infusion-plugin-server/infusion-plugin-server");
const session_writer_service_1 = require("../src/session-writer/session-writer-service");
const session_writer_configuration_1 = require("../src/session-writer/session-writer-configuration");
const markup_modifier_1 = require("../src/infusion-server/application-services/markup-modifier");
const infusion_modification_1 = require("../src/infusion-server/domain/infusion-modification");
const infusion_configuration_1 = require("../src/infusion-server/domain/infusion-configuration");
const proxy_service_1 = require("../src/infusion-server/application-services/proxy-service");
const winston_logger_1 = require("../src/winston-logger");
const request = require("request-json");
const port = 8001;
const target = 'http://jccsubweb.newgen.corp';
class OnionTestSetup {
    constructor() {
        this.configuration = new infusion_configuration_1.InfusionConfiguration();
    }
    startTest() {
        this.log = new winston_logger_1.WinstonLog();
        this.writerConfig = new session_writer_configuration_1.SessionWriterConfiguration();
        this.writerConfig.database = 'usproxy';
        this.writerConfig.password = 'usg';
        this.writerConfig.user = 'dev';
        this.writerConfig.server = 'localhost';
        new session_writer_service_1.SessionWriterService(this.log, this.writerConfig).listen(3001);
        this.configuration.modifications = this.getModifications();
        this.markupModifier = new markup_modifier_1.MarkupModifier(this.log);
        this.proxyService = new proxy_service_1.ProxyService(this.log, this.markupModifier, this.configuration);
        let clientToSessionWriter = request.createClient('http://localhost:3001');
        this.proxyService.on('infusionResponse', (context) => {
            clientToSessionWriter.post('/', context.flatten(), (err, res, body) => {
            });
        });
        this.proxyService.listen(3000, target, port);
        let pluginPath = path.join(__dirname, '\\..\\..\\infusions');
        let pluginEnumerator = new infusion_plugin_enumerator_1.InfusionPluginEnumerator(this.log, new local_file_enumerator_1.LocalFileEnumerator(this.log), new local_file_reader_1.LocalFileReader(this.log), pluginPath);
        this.infusionPluginServer = new infusion_plugin_server_1.InfusionPluginServer(this.log, 'http://127.0.0.1', pluginPath, pluginEnumerator);
        this.infusionPluginServer.listen(3002);
    }
    getModifications() {
        return [
            new infusion_modification_1.InfusionModification('body', `<script type="text/javascript" src="http://127.0.0.1:3002/hw_bundle.js"></script>`, infusion_modification_1.InfusionModificationType.Append, /(http?)(\:\/\/)(.*)(\/)(Login)(\.aspx)(.*)/)
        ];
    }
}
exports.OnionTestSetup = OnionTestSetup;
