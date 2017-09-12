"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_upload_service_1 = require("../src/plugin-upload-service/plugin-upload-service");
const session_query_by_id_1 = require("../src/session-query-service/session-query-by-id");
const session_query_configuration_1 = require("../src/session-query-service/session-query-configuration");
const session_query_all_1 = require("../src/session-query-service/session-query-all");
const session_query_service_1 = require("../src/session-query-service/session-query-service");
const auto_html_service_1 = require("../src/automated-html-service/auto-html-service");
const plugin_info_extractor_1 = require("../src/plugin-query-service/plugin-info-extractor");
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
        this.startupSessionWriterService(3001);
        this.startupProxyService(3000, 3001);
        this.startupInfusionPluginServer(3002);
        this.startupAutomatedXmlService(3004);
        this.startupSessionQueryService(3005);
        this.startupPluginUploadService(3006);
    }
    startupProxyService(port, sessionWriterPort) {
        this.configuration.modifications = this.getModifications();
        this.markupModifier = new markup_modifier_1.MarkupModifier(this.log);
        this.proxyService = new service_1.ProxyService(this.log, this.markupModifier, this.configuration);
        let clientToSessionWriter = request.createClient(`http://localhost:${sessionWriterPort}`);
        /*
        this.proxyService.on('infusionResponse',(context : Context) => {
          clientToSessionWriter.post('/', context.flatten(), (err, res, body) => {
          });
        });
    */
        this.proxyService.listen(3000, target, port);
    }
    startupSessionWriterService(port) {
        let writerConfig = new session_writer_configuration_1.SessionWriterConfiguration('dev', 'usg', 'localhost', 'usproxy');
        new session_writer_service_1.SessionWriterService(this.log, writerConfig).listen(port);
    }
    startupInfusionPluginServer(port) {
        let pluginPath = path.join(__dirname, '\\..\\..\\infusions');
        let pluginEnumerator = new plugin_enumerator_1.PluginEnumerator(this.log, new plugin_info_extractor_1.PluginInfoExtractor(this.log, new local_file_reader_1.LocalFileReader(this.log)), new local_file_enumerator_1.LocalFileEnumerator(this.log), pluginPath);
        let pluginQuery = new plugin_query_1.PluginQuery(this.log, pluginEnumerator);
        this.infusionPluginServer = new query_service_1.QueryService(this.log, 'http://127.0.0.1', pluginPath, pluginEnumerator, pluginQuery);
        this.infusionPluginServer.on('pluginsForUrl', (plugins) => {
            let automateHtmlClient = request.createClient('http://127.0.0.1:3004');
            automateHtmlClient.post('/', plugins, (err, res, body) => {
                this.log.debug(`body-${body}`);
            });
        });
        this.infusionPluginServer.listen(3002);
    }
    startupAutomatedXmlService(port) {
        let automatedHtml = new auto_html_service_1.AutomatedHtmlService(this.log);
        automatedHtml.listen(port);
    }
    startupSessionQueryService(port) {
        let sessionQueryConfig = new session_query_configuration_1.SessionQueryConfiguration('dev', 'usg', 'localhost', 'usproxy');
        let sessionQueryAll = new session_query_all_1.SessionQueryAll(this.log, sessionQueryConfig);
        let sessionQueryById = new session_query_by_id_1.SessionQueryById(this.log, sessionQueryConfig);
        let sessionQueryService = new session_query_service_1.SessionQueryService(this.log, sessionQueryAll, sessionQueryById);
        sessionQueryService.listen(port);
    }
    startupPluginUploadService(port) {
        let uploadService = new plugin_upload_service_1.PluginUploadService(this.log);
        uploadService.listen(port);
    }
    getModifications() {
        return [
            new modification_1.InfusionModification('body', `<script type="text/javascript" src="http://127.0.0.1:3002/callback.js"></script>`, modification_1.InfusionModificationType.Append, /(http?)(\:\/\/)(.*)(\/)(Login)(\.aspx)(.*)/)
        ];
    }
}
exports.OnionTestSetup = OnionTestSetup;
