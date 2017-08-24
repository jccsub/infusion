"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InfusionErrorHandler {
    constructor(log) {
        this.log = log;
    }
    handle(err, req, res) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Something went wrong: ${err}`);
    }
}
exports.InfusionErrorHandler = InfusionErrorHandler;
