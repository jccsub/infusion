import { Log } from '../logger';
import * as express from 'express';
import * as jwt from 'express-jwt';
import * as jwksRsa from 'jwks-rsa';

export class TestService {

  //Following along with https://auth0.com/docs/quickstart/backend/nodejs/01-authorization

  //Use postman to test.
  //Not using scopes.
  private app: any;
  private log : Log;
  private clientPath : string;

  constructor(log : Log, clientPath : string ) {
    this.app = express();
    this.log = log;
    this.clientPath = clientPath;
    this.app.use(express.static(this.clientPath));         
    let checkJwt = this.getCheckJwtMiddleware();
    this.app.use(checkJwt);
    this.app.get('/protected',  (req,res) => {
      res.send('This was protected');
    });   
  }

  private getCheckJwtMiddleware() {
    return jwt({
      // Dynamically provide a signing key
      // based on the kid in the header and 
      // the singing keys provided by the JWKS endpoint.
      secret: (<any>jwksRsa).expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://jccsub.auth0.com/.well-known/jwks.json`
      }),

      // Validate the audience and the issuer.
      audience: 'infusion-test-service',
      issuer: `https://jccsub.auth0.com/`,
      algorithms: ['RS256']
    }); 
  }

  

  public listen(port : number) {
    this.app.listen(port);
    this.log.info(`Test Server listening on port ${port}`);
  }

}