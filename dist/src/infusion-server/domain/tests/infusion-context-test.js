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
const infusion_configuration_1 = require("../infusion-configuration");
const infusion_context_1 = require("../infusion-context");
const winston_logger_1 = require("../../../winston-logger");
const mocha_typescript_1 = require("mocha-typescript");
const chai_1 = require("chai");
let ProxyContextIsCreated = class ProxyContextIsCreated {
    before() {
        chai_1.should();
        this.log = new winston_logger_1.WinstonLog();
        this.configuration = new infusion_configuration_1.InfusionConfiguration();
        this.infusionContext = new infusion_context_1.InfusionContext(this.log, this.configuration);
    }
    toStringWillPrintInitializedContext() {
        this.infusionContext.toString();
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProxyContextIsCreated.prototype, "toStringWillPrintInitializedContext", null);
ProxyContextIsCreated = __decorate([
    mocha_typescript_1.suite
], ProxyContextIsCreated);
