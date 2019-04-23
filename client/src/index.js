import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { BrowserRouter as Router } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {main: '#263238', light: '#4f5b62', dark: '#000a12' },
    secondary: {main: '#4fc3f7', light: '#8bf6ff', dark: '#0093c4'},
    error: {main: '#e57373'},

    //test: {main: '#5E35B1'}
  }
});

const client = new ApolloClient({
  uri: process.env.REACT_APP_APOLLO_URI || 'http://localhost:4000/',
  cache: new InMemoryCache(),
});

// const client = ... // create Apollo client

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
  <ApolloProvider client={client}>
    <ApolloHooksProvider client={client}>
      <Router>
        <App />
      </Router>
    </ApolloHooksProvider>
  </ApolloProvider>
  </MuiThemeProvider>,
  document.getElementById('root')
);
