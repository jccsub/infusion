import { SessionWriterService } from './session-writer/session-writer-service';
import { SessionWriterConfiguration } from './session-writer/session-writer-configuration';
import { WinstonLog } from './winston-logger';
import { SessionWriter } from './session-writer/session-writer';
import { OnionTestSetup } from '../test/onion-test-setup';


var testSetup = new OnionTestSetup();
testSetup.startTest();
