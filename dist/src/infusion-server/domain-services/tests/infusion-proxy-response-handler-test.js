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
const infusion_configuration_1 = require("../../domain/infusion-configuration");
const infusion_context_1 = require("../../domain/infusion-context");
const infusion_proxy_response_handler_1 = require("../event-handlers/infusion-proxy-response-handler");
const winston_logger_1 = require("../../../winston-logger");
const mocha_typescript_1 = require("mocha-typescript");
const chai_1 = require("chai");
let InfusionProxyResponseHandlerTest = class InfusionProxyResponseHandlerTest {
    before() {
        chai_1.should();
        this.log = new winston_logger_1.WinstonLog();
        this.proxyResponseHandler = new infusion_proxy_response_handler_1.InfusionProxyResponseHandler(this.log);
        this.proxyRes = {
            headers: {
                'content-encoding': 'text'
            }
        };
        this.req = {};
        this.res = {};
        this.config = new infusion_configuration_1.InfusionConfiguration();
        this.req.context = new infusion_context_1.InfusionContext(this.log, this.config);
        this.proxyRes.on = (event, callback) => {
            this.eventString = event;
            if (event === 'data') {
                this.eventDataCallback = callback;
            }
            else {
                this.eventEndCallback = callback;
            }
        };
    }
    handleThrowsExceptionIfContextDoesNotExist() {
        this.req.context = null;
        let exception = false;
        try {
            this.proxyResponseHandler.handle(this.proxyRes, this.req, this.res);
        }
        catch (ex) {
            exception = true;
        }
        exception.should.equal(true);
    }
    handleSetsUpResponseHandlerDataCallback() {
        this.proxyResponseHandler.handle(this.proxyRes, this.req, this.res);
        chai_1.expect(this.eventDataCallback).to.not.equal(null);
        this.eventDataCallback('test');
    }
    handleSetsUpResponseHandlerEndCallback() {
        this.proxyResponseHandler.handle(this.proxyRes, this.req, this.res);
        chai_1.expect(this.eventEndCallback).to.not.equal(null);
        this.eventEndCallback();
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InfusionProxyResponseHandlerTest.prototype, "handleThrowsExceptionIfContextDoesNotExist", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InfusionProxyResponseHandlerTest.prototype, "handleSetsUpResponseHandlerDataCallback", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InfusionProxyResponseHandlerTest.prototype, "handleSetsUpResponseHandlerEndCallback", null);
InfusionProxyResponseHandlerTest = __decorate([
    mocha_typescript_1.suite
], InfusionProxyResponseHandlerTest);
