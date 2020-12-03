import React from 'react'
import { hot } from 'react-hot-loader'
import './App.css';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom"
import Dashboard from "./components/Dashboard"

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Dashboard/>
        </Route>
      </Switch>
    </Router>
  )
}

export default hot(module)(App);