import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { BrowserRouter as Router } from 'react-router-dom';

const httpLink = createHttpLink({
  uri: 'http://localhost:4466',
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

// const client = ... // create Apollo client

ReactDOM.render(
  <ApolloProvider client={client}>
    <ApolloHooksProvider client={client}>
      <Router>
        <App />
      </Router>
    </ApolloHooksProvider>
  </ApolloProvider>,
  document.getElementById('root')
);
