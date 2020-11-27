import React from 'react'
import { hot } from 'react-hot-loader'
import './App.css';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom"
import Dashboard from "./components/Dashboard"
import UpdateOverview from "./components/NotificationOverview"
import OtherList from "./components/OtherList"

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Dashboard/>
        </Route>
        <Route path="/updates">
          <UpdateOverview />
        </Route>
        <Route
          path='/list/:userId'
          render={(props) => <OtherList owner={Number(props.match.params.userId)} />}
        />
      </Switch>
    </Router>
  )
}

export default hot(module)(App);