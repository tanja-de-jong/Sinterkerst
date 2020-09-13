import React from 'react'
import ReactDOM from 'react-dom'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { Provider } from 'react-redux'
import { configureStore } from "./store"
import App from './App.js'
import { Auth0Provider } from "@auth0/auth0-react";

const store = configureStore()
const persistor = persistStore(store)

ReactDOM.render(
  <Auth0Provider
    deomain="twilight-snowflake-4165.us.auth0.com"
    clientId="ouNiX97PZu371wUNRB0Z7LGzPrcFoYcl"
    redirectUri={window.location.origin}
  >
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </Auth0Provider>,
  document.getElementById('root')
);
