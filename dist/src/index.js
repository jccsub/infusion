"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const onion_test_setup_1 = require("../test/onion-test-setup");
const express = require("express");
var port = 3000;
var app = express();
console.log(__dirname + `\\..\\infusions`);
app.use('/infusions', express.static(__dirname + `\\..\\..\\infusions`));
app.listen(port, function () {
    console.log('plugin server listening on port ' + port);
});
var testSetup = new onion_test_setup_1.OnionTestSetup();
testSetup.startTest();
