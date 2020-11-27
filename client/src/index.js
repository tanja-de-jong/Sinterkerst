import React from 'react'
import ReactDOM from 'react-dom'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { Provider } from 'react-redux'
import { createBrowserHistory } from 'history';
import { configureStore } from "./redux/store"
import App from './App.js'
import { Auth0Provider } from "@auth0/auth0-react";

const initialState = {
  items: {},
  users: {},
  logs: {}
}
const store = configureStore(initialState)
const persistor = persistStore(store)
const history = createBrowserHistory()

const onRedirectCallback = (appState) => {
  // Use the router's history module to replace the url
  history.replace(appState?.returnTo || window.location.pathname);
}

ReactDOM.render(
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>,
  document.getElementById('root')
);
