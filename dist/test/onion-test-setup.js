"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_query_1 = require("../src/plugin-query-service/plugin-query");
const path = require("path");
const plugin_enumerator_1 = require("../src/plugin-query-service/plugin-enumerator");
const local_file_reader_1 = require("../src/plugin-query-service/infrastructure/local-file-reader");
const local_file_enumerator_1 = require("../src/plugin-query-service/infrastructure/local-file-enumerator");
const query_service_1 = require("../src/plugin-query-service/query-service");
const session_writer_service_1 = require("../src/session-writer-service/session-writer-service");
const session_writer_configuration_1 = require("../src/session-writer-service/session-writer-configuration");
const markup_modifier_1 = require("../src/proxy-service/application-services/markup-modifier");
const modification_1 = require("../src/proxy-service/domain/modification");
const configuration_1 = require("../src/proxy-service/domain/configuration");
const service_1 = require("../src/proxy-service/application-services/service");
const winston_logger_1 = require("../src/winston-logger");
const request = require("request-json");
const port = 8001;
const target = 'http://jccsubweb.newgen.corp';
class OnionTestSetup {
    constructor() {
        this.configuration = new configuration_1.Configuration();
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
        this.proxyService = new service_1.ProxyService(this.log, this.markupModifier, this.configuration);
        let clientToSessionWriter = request.createClient('http://localhost:3001');
        this.proxyService.on('infusionResponse', (context) => {
            clientToSessionWriter.post('/', context.flatten(), (err, res, body) => {
            });
        });
        this.proxyService.listen(3000, target, port);
        let pluginPath = path.join(__dirname, '\\..\\..\\infusions');
        let pluginEnumerator = new plugin_enumerator_1.PluginEnumerator(this.log, new local_file_enumerator_1.LocalFileEnumerator(this.log), new local_file_reader_1.LocalFileReader(this.log), pluginPath);
        let pluginQuery = new plugin_query_1.PluginQuery(this.log, pluginEnumerator);
        this.infusionPluginServer = new query_service_1.QueryService(this.log, 'http://127.0.0.1', pluginPath, pluginEnumerator, pluginQuery);
        this.infusionPluginServer.listen(3002);
    }
    getModifications() {
        return [
            new modification_1.InfusionModification('body', `<script type="text/javascript" src="http://127.0.0.1:3002/hw_bundle.js"></script>`, modification_1.InfusionModificationType.Append, /(http?)(\:\/\/)(.*)(\/)(Login)(\.aspx)(.*)/)
        ];
    }
}
exports.OnionTestSetup = OnionTestSetup;
