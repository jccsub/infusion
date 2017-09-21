import { ClientTest } from '../test/client-test';
import { WinstonLog } from './winston-logger';
import { OnionTestSetup } from '../test/onion-test-setup';

let log = new WinstonLog();
//var testSetup = new OnionTestSetup(log);
var testSetup = new ClientTest(log);
testSetup.startTest();
