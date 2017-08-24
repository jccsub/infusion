"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InfusionPathRewriteHandler {
    constructor(log) {
        this.log = log;
    }
    /* istanbul ignore next */
    handle(path, req) {
        //If doing a path rewrite, simply set req.newPath to whatever path should
        //be written.
    }
}
exports.InfusionPathRewriteHandler = InfusionPathRewriteHandler;
