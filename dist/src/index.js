"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const session_writer_service_1 = require("./session-writer/session-writer-service");
const session_writer_configuration_1 = require("./session-writer/session-writer-configuration");
const winston_logger_1 = require("./winston-logger");
var port = 3000;
var log = new winston_logger_1.WinstonLog();
var config = new session_writer_configuration_1.SessionWriterConfiguration();
var sw = session_writer_service_1.SessionWriterService.bootstrap();
sw.listen(port);
/*
var app = express();
console.log(__dirname + `\\..\\infusions`);
app.use('/infusions',express.static(__dirname + `\\..\\..\\infusions`));
app.listen(port,function() {
  console.log('plugin server listening on port ' + port);
});


var testSetup = new OnionTestSetup();
testSetup.startTest();
*/ 
