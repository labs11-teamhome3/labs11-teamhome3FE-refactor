import auth0 from 'auth0-js';

export default class Auth {
  auth0 = new auth0.WebAuth({
    domain: 'manaje.auth0.com',
    clientID: 'yZSx2aTdImOQ8zWCqRZ5hhZJr6c7KXFz',
    redirectUri: 'http://localhost:3000/dashboard',
    responseType: 'token id_token',
    scope: 'openid'
  });

  login() {
    this.auth0.authorize();
  }
}