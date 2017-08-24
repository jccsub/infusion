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
const infusion_request_handler_1 = require("../event-handlers/infusion-request-handler");
const infusion_configuration_1 = require("../../domain/infusion-configuration");
const infusion_context_1 = require("../../domain/infusion-context");
const winston_logger_1 = require("../../../winston-logger");
const mocha_typescript_1 = require("mocha-typescript");
const chai_1 = require("chai");
let InfusionRequestHandlerTest = class InfusionRequestHandlerTest {
    before() {
        chai_1.should();
        this.log = new winston_logger_1.WinstonLog();
        this.req = {};
        this.req.headers = {};
        this.req.headers.host = '';
        this.req.connection = {};
        this.req.connection.encrypted = false;
        this.res = {};
        this.proxyRes = {};
        this.config = new infusion_configuration_1.InfusionConfiguration();
        this.context = new infusion_context_1.InfusionContext(this.log, this.config);
        this.requestHandler = new infusion_request_handler_1.InfusionRequestHandler(this.log, this.req, this.context);
    }
    onDataAppendsToTheRequestBody() {
        this.context.request.body = '';
        this.requestHandler.onData('test1');
        this.requestHandler.onData('23');
        this.context.request.body.should.equal('test123');
    }
    onEndSetsTheRequestProperties() {
        this.req.url = 'test';
        this.req.headers.host = 'host';
        this.req.method = 'GET';
        this.requestHandler.onEnd();
        this.context.request.url.should.equal('test');
        this.context.request.host.should.equal('host');
        this.context.request.protocol.should.equal('http');
        this.context.request.method = 'GET';
    }
    onEndSetsTheProtocolToHttpsIfEncrypted() {
        this.req.connection.encrypted = true;
        this.requestHandler.onEnd();
        this.context.request.protocol.should.equal('https');
    }
    onEndGetsTheAspNetSession() {
        this.req.headers.cookie = 'cookie1=1234;ASP.NET_SessionId=5678';
        this.requestHandler.onEnd();
        this.context.request.sessionId.should.equal('5678');
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InfusionRequestHandlerTest.prototype, "onDataAppendsToTheRequestBody", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InfusionRequestHandlerTest.prototype, "onEndSetsTheRequestProperties", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InfusionRequestHandlerTest.prototype, "onEndSetsTheProtocolToHttpsIfEncrypted", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InfusionRequestHandlerTest.prototype, "onEndGetsTheAspNetSession", null);
InfusionRequestHandlerTest = __decorate([
    mocha_typescript_1.suite
], InfusionRequestHandlerTest);
