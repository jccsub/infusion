import { OnionTestSetup } from '../test/onion-test-setup';
import * as express from 'express';

var port = 3000;

var app = express();
console.log(__dirname + `\\..\\infusions`);
app.use('/infusions',express.static(__dirname + `\\..\\..\\infusions`));
app.listen(port,function() {
  console.log('plugin server listening on port ' + port);
});


var testSetup = new OnionTestSetup();
testSetup.startTest();
