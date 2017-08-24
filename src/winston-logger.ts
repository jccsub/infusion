
import * as winston from "winston";
import {Log} from './logger';


export class WinstonLog implements Log {
    private tsFormat = () => (new Date()).toLocaleTimeString();
    private _logger : winston.LoggerInstance;

    /* istanbul ignore next */
    constructor() {
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
    get level() : string {
        return this._logger.level;
    }

    /* istanbul ignore next */
    set level(value : string) {
        this._logger.level = value;
    }

    /* istanbul ignore next */
    public debug(message : string) {
        console.log(message);
        this._logger.debug(message);
    }

    /* istanbul ignore next */
    public warn(message : string) {
        this._logger.warn(message);
    }

    /* istanbul ignore next */
    public error(message : string) {
        this._logger.error(message);
    }
    
    /* istanbul ignore next */
    public info(message : string) {
        this._logger.info(message);
    }

}

