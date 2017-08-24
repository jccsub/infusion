"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InfusionResponseHandler {
    constructor(log, context, proxyRes, res) {
        this.log = log;
        this.context = context;
        this.proxyRes = proxyRes;
        this.context.response.body = '';
        this.res = res;
    }
    onData(chunk) {
        this.context.response.body += chunk.toString('utf8');
    }
    onEnd() {
        this.context.response.statusCode = this.proxyRes.statusCode;
        this.context.response.headers = this.proxyRes.headers;
    }
}
exports.InfusionResponseHandler = InfusionResponseHandler;
