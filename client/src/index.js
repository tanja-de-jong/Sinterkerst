import React from 'react'
import ReactDOM from 'react-dom'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { Provider } from 'react-redux'
import { createBrowserHistory } from 'history';
import { configureStore } from "./store"
import App from './App.js'
import { Auth0Provider } from "@auth0/auth0-react";

const store = configureStore()
const persistor = persistStore(store)
const history = createBrowserHistory()

const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
const audience = process.env.REACT_APP_AUDIENCE;

const onRedirectCallback = (appState) => {
  // Use the router's history module to replace the url
  history.replace(appState?.returnTo || window.location.pathname);
}

console.log(process.env)
ReactDOM.render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    redirectUri={window.location.origin}
    onRedirectCallback={onRedirectCallback}
    audience={audience}
  >
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </Auth0Provider>,
  document.getElementById('root')
);
