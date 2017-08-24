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
const infusion_response_handler_1 = require("../event-handlers/infusion-response-handler");
const winston_logger_1 = require("../../../winston-logger");
const mocha_typescript_1 = require("mocha-typescript");
const chai_1 = require("chai");
let InfusionResponseHandlerTest = class InfusionResponseHandlerTest {
    before() {
        chai_1.should();
        this.log = new winston_logger_1.WinstonLog();
        this.req = {};
        this.res = {};
        this.proxyRes = {};
        this.config = new infusion_configuration_1.InfusionConfiguration();
        this.context = new infusion_context_1.InfusionContext(this.log, this.config);
        this.responseHandler = new infusion_response_handler_1.InfusionResponseHandler(this.log, this.context, this.proxyRes, this.res);
    }
    test() {
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InfusionResponseHandlerTest.prototype, "test", null);
InfusionResponseHandlerTest = __decorate([
    mocha_typescript_1.suite
], InfusionResponseHandlerTest);
