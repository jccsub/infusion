"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const infusion_error_handler_1 = require("../event-handlers/infusion-error-handler");
const winston_logger_1 = require("../../../winston-logger");
const mocha_typescript_1 = require("mocha-typescript");
const chai_1 = require("chai");
let InfusionErrorHandlerTest = class InfusionErrorHandlerTest {
    before() {
        chai_1.should();
        this.log = new winston_logger_1.WinstonLog();
        this.errorHandler = new infusion_error_handler_1.InfusionErrorHandler(this.log);
        this.err = new Error('Just testing');
        this.req = {};
        this.res = {};
    }
    responseHeaderIsWritten() {
        var testStatusCode = 0;
        var testContentType = {};
        this.res.end = (placeHolder) => { };
        this.res.writeHead = (statusCode, contentType) => {
            testStatusCode = statusCode;
            testContentType = contentType;
        };
        this.errorHandler.handle(this.err, this.req, this.res);
        testStatusCode.should.equal(500);
        testContentType['Content-Type'].should.equal('text/plain');
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InfusionErrorHandlerTest.prototype, "responseHeaderIsWritten", null);
InfusionErrorHandlerTest = __decorate([
    mocha_typescript_1.suite
], InfusionErrorHandlerTest);
