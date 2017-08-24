"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const infusion_context_1 = require("../../domain/infusion-context");
const infusion_request_handler_1 = require("./infusion-request-handler");
class InfusionProxyRequestHandler {
    constructor(log, config) {
        this.log = log;
        this.config = config;
    }
    handle(proxyReq, req, res) {
        // tslint:disable-next-line:triple-equals
        let context = (req.context == null) ? new infusion_context_1.InfusionContext(this.log, this.config) : req.context;
        context.request.body = '';
        this.setupRequestHandler(req, context);
    }
    setupRequestHandler(req, context) {
        let reqHandler = new infusion_request_handler_1.InfusionRequestHandler(this.log, req, context);
        req.context = context;
        req.on('data', (chunk) => { reqHandler.onData(chunk); });
        req.on('end', () => reqHandler.onEnd());
    }
}
exports.InfusionProxyRequestHandler = InfusionProxyRequestHandler;
