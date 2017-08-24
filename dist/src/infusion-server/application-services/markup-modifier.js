"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MarkupModifier {
    constructor(log) {
        this.log = log;
    }
    performModifications(url, req, res) {
        let context = req.context;
        var getProcessorFunction = require('harmon');
        var func = getProcessorFunction([], this.getModificationQueryFunctions(url, context));
        func(req, res, () => { });
    }
    getModificationQueryFunctions(url, context) {
        let result = new Array();
        context.config.modifications.forEach((modification) => {
            if (modification.urlPattern.test(url)) {
                result.push(modification.convertToQueryFunction());
            }
            else {
            }
        });
        return result;
    }
}
exports.MarkupModifier = MarkupModifier;
