"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_test_1 = require("../test/client-test");
const winston_logger_1 = require("./winston-logger");
let log = new winston_logger_1.WinstonLog();
//var testSetup = new OnionTestSetup(log);
var testSetup = new client_test_1.ClientTest(log);
testSetup.startTest();
