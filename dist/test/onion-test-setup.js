"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const session_writer_service_1 = require("../src/session-services/session-writer-service/session-writer-service");
const session_writer_configuration_1 = require("../src/session-services/session-writer-service/session-writer-configuration");
const modification_1 = require("../src/proxy-services/proxy-service/domain/modification");
const proxy_factory_service_1 = require("../src/proxy-services/proxy-factory-service/proxy-factory-service");
const configuration_1 = require("../src/proxy-services/proxy-service/domain/configuration");
const proxy_provider_service_1 = require("../src/proxy-services/proxy-provider-service/proxy-provider-service");
const local_file_enumerator_1 = require("../src/plugin-services/plugin-query-service/infrastructure/local-file-enumerator");
const plugin_info_extractor_1 = require("../src/plugin-services/plugin-query-service/plugin-info-extractor");
const local_file_reader_1 = require("../src/plugin-services/plugin-query-service/infrastructure/local-file-reader");
const query_service_1 = require("../src/plugin-services/plugin-query-service/query-service");
const proxy_provider_1 = require("../src/common/servicebus/events/proxy-provider");
const redis_dictionary_1 = require("../src/common/dictionary/redis-dictionary");
const rabbitmq_servicebus_1 = require("../src/common/servicebus/rabbitmq-servicebus");
const test_service_1 = require("../src/test-service/test-service");
const portal_server_1 = require("../src/portal/portal-server");
const path = require("path");
const request = require("request-json");
const plugin_enumerator_1 = require("../src/plugin-services/plugin-query-service/plugin-enumerator");
const plugin_query_1 = require("../src/plugin-services/plugin-query-service/plugin-query");
const plugin_upload_service_1 = require("../src/plugin-services/plugin-upload-service/plugin-upload-service");
const session_query_all_1 = require("../src/session-services/session-query-service/session-query-all");
const session_query_by_id_1 = require("../src/session-services/session-query-service/session-query-by-id");
const session_query_service_1 = require("../src/session-services/session-query-service/session-query-service");
const session_query_configuration_1 = require("../src/session-services/session-query-service/session-query-configuration");
const port = 8001;
const target = 'http://jccsubweb.newgen.corp';
class OnionTestSetup {
    constructor(log) {
        this.configuration = new configuration_1.Configuration();
        this.log = log;
        this.servicebus = new rabbitmq_servicebus_1.RabbitMqServiceBus(this.log);
        this.proxyDictionary = new redis_dictionary_1.RedisDictionary(this.log);
    }
    startTest() {
        this.startupSessionWriterService(3001);
        this.startupProxyFactoryService();
        this.startupInfusionPluginServer(3002);
        this.startupSessionQueryService(3005);
        this.startupPluginUploadService(3006);
        this.startupPortalServer(3007);
        this.startupTestService(3008);
        this.startupProxyProviderService();
    }
    startupProxyProviderService() {
        let providerService = new proxy_provider_service_1.ProxyProviderService(this.log, this.servicebus, this.configuration, this.proxyDictionary);
        providerService.listen();
        let sb = new rabbitmq_servicebus_1.RabbitMqServiceBus(this.log);
        sb.listen(proxy_provider_1.ProxyProviderResponse.event, (response) => {
            this.log.warn(`oniontest - received proxy provider response: ${response.url}`);
        });
        let sb2 = new rabbitmq_servicebus_1.RabbitMqServiceBus(this.log);
        sb2.send(proxy_provider_1.ProxyProviderRequest.event, new proxy_provider_1.ProxyProviderRequest('jccsub'));
        setTimeout(() => {
            let sb3 = new rabbitmq_servicebus_1.RabbitMqServiceBus(this.log);
            sb3.listen(proxy_provider_1.ProxyProviderResponse.event, (response) => {
                this.log.warn(`oniontest - received proxy provider response: ${response.url}`);
            });
            sb3.send(proxy_provider_1.ProxyProviderRequest.event, new proxy_provider_1.ProxyProviderRequest('jccsub'));
        }, 5000);
    }
    startupProxyFactoryService() {
        this.configuration.modifications = this.getModifications();
        let proxyFactory = new proxy_factory_service_1.ProxyFactoryService(this.log, new rabbitmq_servicebus_1.RabbitMqServiceBus(this.log), this.configuration);
        proxyFactory.listen();
    }
    startupTestService(port) {
        let clientPath = '\\..\\..\\src\\test-service';
        new test_service_1.TestService(this.log, clientPath).listen(port);
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
    startupPortalServer(port) {
        let clientPath = path.join(__dirname, '\\..\\..\\dist');
        let portalServer = new portal_server_1.PortalServer(this.log, clientPath);
        portalServer.listen(port);
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
