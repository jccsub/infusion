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
const infusion_modification_1 = require("../../domain/infusion-modification");
const markup_modifier_1 = require("../markup-modifier");
const infusion_configuration_1 = require("../../domain/infusion-configuration");
const infusion_context_1 = require("../../domain/infusion-context");
const winston_logger_1 = require("../../../winston-logger");
const mocha_typescript_1 = require("mocha-typescript");
const chai_1 = require("chai");
let MarkupModifierTest = class MarkupModifierTest {
    before() {
        chai_1.should();
        this.log = new winston_logger_1.WinstonLog();
        this.configuration = new infusion_configuration_1.InfusionConfiguration();
        this.infusionContext = new infusion_context_1.InfusionContext(this.log, this.configuration);
        this.markupModifier = new markup_modifier_1.MarkupModifier(this.log);
        this.req = process.stdout;
        this.res = process.stdin;
        this.req.context = this.infusionContext;
        this.url = 'http://123.4.5.6/test';
    }
    testModificationsToReplace() {
        this.setupContextToReplace();
        this.markupModifier.performModifications(this.url, this.req, this.res);
    }
    testModificationsToAppend() {
        this.setupContextToAppend();
        this.markupModifier.performModifications(this.url, this.req, this.res);
    }
    setupContextToReplace() {
        this.infusionContext.config.modifications = [
            new infusion_modification_1.InfusionModification('h1', '<h1>Applied</h1>', infusion_modification_1.InfusionModificationType.Replace, /test/),
            new infusion_modification_1.InfusionModification('h1', '<h1>NotApplied</h1>', infusion_modification_1.InfusionModificationType.Replace, /notfound/),
        ];
    }
    setupContextToAppend() {
        this.infusionContext.config.modifications = [
            new infusion_modification_1.InfusionModification('h1', '<h1>Applied</h1>', infusion_modification_1.InfusionModificationType.Append, /test/),
            new infusion_modification_1.InfusionModification('h1', '<h1>NotApplied</h1>', infusion_modification_1.InfusionModificationType.Append, /notfound/),
        ];
    }
};
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MarkupModifierTest.prototype, "testModificationsToReplace", null);
__decorate([
    mocha_typescript_1.test,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MarkupModifierTest.prototype, "testModificationsToAppend", null);
MarkupModifierTest = __decorate([
    mocha_typescript_1.suite
], MarkupModifierTest);
