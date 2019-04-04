import auth0 from 'auth0-js';

import history from '../history';

export default class Auth {
  auth0 = new auth0.WebAuth({
    domain: 'manaje.auth0.com',
    clientID: 'yZSx2aTdImOQ8zWCqRZ5hhZJr6c7KXFz',
    redirectUri: `${process.env.REACT_APP_REDIRECT_URL}/dashboard`,
    responseType: 'token id_token',
    scope: 'openid profile email'
  });

  accessToken;
  idToken;
  expiresAt;

  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.getIdToken = this.getIdToken.bind(this);
    this.renewSession = this.renewSession.bind(this);
  }

  handleAuthentication() {
    console.log('inside handleAuth');
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
      } else if (err) {
        history.replace('/');
        console.log(err);
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

  login() {
    this.auth0.authorize();
  }

  logout() {
    // Remove tokens and expiry time
    this.accessToken = null;
    this.idToken = null;
    this.expiresAt = 0;

    // Remove isLoggedIn flag, idToken, and accessToken from localStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('idToken');
    localStorage.removeItem('accessToken');

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

  setSession(authResult) {
    console.log('hey')
    // Set isLoggedIn flag in localStorage
    localStorage.setItem('isLoggedIn', 'true');
    // Set idToken and accessToken in localStorage
    localStorage.setItem('idToken', authResult.idToken);
    localStorage.setItem('accessToken', authResult.accessToken);
    console.log('authResult', authResult)

    // Set the time that the access token will expire at
    let expiresAt = (authResult.expiresIn * 1440000) + new Date().getTime();
    this.accessToken = authResult.accessToken;
    this.idToken = authResult.idToken;
    this.expiresAt = expiresAt;

    // navigate to the home route
    history.replace('/dashboard');
  }

  renewSession() {
    this.auth0.checkSession({}, (err, authResult) => {
       if (authResult && authResult.accessToken && authResult.idToken) {
         this.setSession(authResult);
       } else if (err) {
         this.logout();
         console.log(err);
         alert(`Could not get a new token (${err.error}: ${err.error_description}).`);
       }
    });
  }

}
