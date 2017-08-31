"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const infusion_request_1 = require("./infusion-request");
const infusion_response_1 = require("./infusion-response");
var InfusionContextDirection;
(function (InfusionContextDirection) {
    InfusionContextDirection[InfusionContextDirection["Request"] = 0] = "Request";
    InfusionContextDirection[InfusionContextDirection["Response"] = 1] = "Response";
})(InfusionContextDirection = exports.InfusionContextDirection || (exports.InfusionContextDirection = {}));
class InfusionContext {
    constructor(log, config) {
        this.response = new infusion_response_1.InfusionResponse();
        this.request = new infusion_request_1.InfusionRequest();
        this.rewritePath = '';
        this.config = config;
        this.log = log;
    }
    toString() {
        let result = '';
        result += '\n---------------------------------------';
        result += '\ncontext = {\n';
        /* istanbul ignore next */
        // tslint:disable-next-line:triple-equals
        if (this.error != null) {
            result += `\n\terror-message: ${this.error.message}`;
        }
        result += `\n\trequest-body: ${this.request.body}`;
        result += `\n\trequest-url: ${this.request.fullUrl}`;
        result += `\n\trequest-method: ${this.request.method}`;
        result += `\n\trequest-sessionId: ${this.request.sessionId}`;
        result += `\n\tresponse-headers: ${JSON.stringify(this.response.headers)}`;
        result += '\n---------------------------------------';
        return result;
    }
    flatten() {
        let result = {};
        result.responseBody = this.response.body;
        result.responseHeaders = JSON.stringify(this.response.headers);
        result.responseStatusCode = this.response.statusCode;
        result.requestBody = this.request.body;
        result.requestHeaders = JSON.stringify(this.request.headers);
        result.requestUrl = this.request.fullUrl;
        result.requestProtocol = this.request.protocol;
        result.requestHost = this.request.host;
        result.requestMethod = this.request.method;
        result.requestApplicationSessionId = this.request.sessionId;
        result.modifications = JSON.stringify(this.config.modifications);
        result.rewritePath = this.rewritePath;
        result.error = this.error;
        result.user = this.user;
        return result;
    }
}
exports.InfusionContext = InfusionContext;
