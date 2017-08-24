"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
class WinstonLog {
    /* istanbul ignore next */
    constructor() {
        this.tsFormat = () => (new Date()).toLocaleTimeString();
        this._logger = new (winston.Logger)({
            transports: [
                new (winston.transports.Console)({
                    timestamp: this.tsFormat,
                    colorize: true,
                })
            ]
        });
    }
    /* istanbul ignore next */
    get level() {
        return this._logger.level;
    }
    /* istanbul ignore next */
    set level(value) {
        this._logger.level = value;
    }
    /* istanbul ignore next */
    debug(message) {
        console.log(message);
        this._logger.debug(message);
    }
    /* istanbul ignore next */
    warn(message) {
        this._logger.warn(message);
    }
    /* istanbul ignore next */
    error(message) {
        this._logger.error(message);
    }
    /* istanbul ignore next */
    info(message) {
        this._logger.info(message);
    }
}
exports.WinstonLog = WinstonLog;
