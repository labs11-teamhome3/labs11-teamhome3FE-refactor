import history from '../history';

export default function setSession(authResult) {
    console.log('hey')
    // Set isLoggedIn flag in localStorage
    localStorage.setItem('isLoggedIn', 'true');
    // Set idToken and accessToken in localStorage
    localStorage.setItem('idToken', authResult.idToken);
    localStorage.setItem('accessToken', authResult.accessToken);
    console.log('authResult', authResult)

    // Set the time that the access token will expire at
    let expiresAt = (authResult.expiresIn * 1440000) + new Date().getTime();

    // navigate to the home route
    history.replace('/');
}

function renewSession() {
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