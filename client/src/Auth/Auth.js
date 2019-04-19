import auth0 from 'auth0-js';

import history from './history';

export default class Auth {
  auth0 = new auth0.WebAuth({
    domain: 'manaje.auth0.com',
    clientID: 'yZSx2aTdImOQ8zWCqRZ5hhZJr6c7KXFz',
    redirectUri: `${process.env.REACT_APP_REDIRECT_URL}`,
    responseType: 'token id_token',
    scope: 'openid profile email',
  });

  accessToken;
  idToken;
  expiresAt;

  constructor() {
    this.login = this.login.bind(this);
    this.signup = this.signup.bind(this);
    this.signupNow = this.signupNow.bind(this);
    this.logout = this.logout.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.getIdToken = this.getIdToken.bind(this);
  }

  signupNow() {
    this.auth0.authorize();
  }

  signup() {
    this.auth0.authorize();
  }

  login() {
    this.auth0.authorize();
  }

  logout() {
    // Remove tokens and expiry time
    this.accessToken = null;
    this.idToken = null;
    this.expiresAt = 1;

    // Remove isLoggedIn flag, idToken, and accessToken from localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('idToken');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');

    // navigate to the home route
    history.replace('/');

    // refresh window
    window.location.reload();
  }

  getAccessToken() {
    return this.accessToken;
  }

  getIdToken() {
    return this.idToken;
  }
}
