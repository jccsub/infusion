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
const infusion_context_1 = require("../../domain/infusion-context");
const infusion_configuration_1 = require("../../domain/infusion-configuration");
const infusion_proxy_request_handler_1 = require("../event-handlers/infusion-proxy-request-handler");
const winston_logger_1 = require("../../../winston-logger");
const mocha_typescript_1 = require("mocha-typescript");
const chai_1 = require("chai");
let InfusionProxyRequestHandlerTest = class InfusionProxyRequestHandlerTest {
    before() {
        chai_1.should();
        this.log = new winston_logger_1.WinstonLog();
        this.config = new infusion_configuration_1.InfusionConfiguration();
        this.proxyRequestHandler = new infusion_proxy_request_handler_1.InfusionProxyRequestHandler(this.log, this.config);
        this.proxyReq = {};
        this.req = {};
        this.res = {};
        this.req.on = (event, callback) => {
            this.eventString = event;
            if (event === 'data') {
                this.eventDataCallback = callback;
            }
            else {
                this.eventEndCallback = callback;
            }
        };
    }
    handleCreatesANewContextOnReqIfItDoesntExist() {
        this.req.context = null;
        this.proxyRequestHandler.handle(this.proxyReq, this.req, this.res);
        chai_1.expect(this.req.context).to.not.equal(null);
    }
    handleUsesExistingContextOnReqIfItExist() {
        this.req.context = new infusion_context_1.InfusionContext(this.log, this.config);
        var holdContext = this.req.context;
        this.proxyRequestHandler.handle(this.proxyReq, this.req, this.res);
        chai_1.expect(this.req.context).to.equal(holdContext);
    }
    handleSetsUpRequestHandlerDataCallback() {
        this.req.context = new infusion_context_1.InfusionContext(this.log, this.config);
        var holdContext = this.req.context;
        this.proxyRequestHandler.handle(this.proxyReq, this.req, this.res);
        chai_1.expect(this.eventDataCallback).to.not.equal(null);
        this.eventDataCallback('test');
    }
    handleSetsUpRequestHandlerEndCallback() {
        this.req.context = new infusion_context_1.InfusionContext(this.log, this.config);
        var holdContext = this.req.context;
        this.proxyRequestHandler.handle(this.proxyReq, this.req, this.res);
        chai_1.expect(this.eventEndCallback).to.not.equal(null);
        try {
            this.eventEndCallback();
        }
        catch (ex) {
            //Disregard the error
        }
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InfusionProxyRequestHandlerTest.prototype, "handleCreatesANewContextOnReqIfItDoesntExist", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InfusionProxyRequestHandlerTest.prototype, "handleUsesExistingContextOnReqIfItExist", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InfusionProxyRequestHandlerTest.prototype, "handleSetsUpRequestHandlerDataCallback", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InfusionProxyRequestHandlerTest.prototype, "handleSetsUpRequestHandlerEndCallback", null);
InfusionProxyRequestHandlerTest = __decorate([
    mocha_typescript_1.suite
], InfusionProxyRequestHandlerTest);
