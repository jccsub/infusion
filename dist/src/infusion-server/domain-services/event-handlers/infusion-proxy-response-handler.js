"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zlib = require("zlib");
const infusion_response_handler_1 = require("./infusion-response-handler");
class InfusionProxyResponseHandler {
    constructor(log) {
        this.log = log;
    }
    handle(proxyRes, req, res) {
        let context = req.context;
        // tslint:disable-next-line:triple-equals
        if (context == null) {
            throw new Error('InfusionProxyResponseHandler.handle - req.context cannot be null');
        }
        let resHandler = new infusion_response_handler_1.InfusionResponseHandler(this.log, context, proxyRes, res);
        var encoding = proxyRes.headers['content-encoding'];
        var output;
        /* istanbul ignore next */
        // tslint:disable-next-line:triple-equals
        if (encoding == 'gzip') {
            var gzip = zlib.createGunzip();
            proxyRes.pipe(gzip);
            output = gzip;
        }
        else {
            output = proxyRes;
        }
        output.on('data', (chunk) => {
            resHandler.onData(chunk);
        });
        output.on('end', () => {
            resHandler.onEnd();
        });
    }
}
exports.InfusionProxyResponseHandler = InfusionProxyResponseHandler;
