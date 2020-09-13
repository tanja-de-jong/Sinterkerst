import React, {useEffect} from 'react'
import { hot } from 'react-hot-loader'
import './App.css';
import UploadForm from "./upload-transactions/UploadForm"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Dashboard from "./transactions/Dashboard"
import CategorySettings from "./categories/CategorySettings"
import TransactionOverview from "./transactions/TransactionOverview"
import IncomeExpensesDashboard from "./income-expenses/IncomeExpensesDashboard"
import Settings from "./Settings"
import {loadRules} from "./rules/thunks"
import {connect} from "react-redux"
import {loadTransactions} from "./transactions/thunks"
import {loadCategories} from "./categories/thunks"
import {transactionsLoading} from "./transactions/selectors"
import {categoriesLoading} from "./categories/selectors"
import {rulesLoading} from "./rules/selectors"
import { useAuth0 } from "@auth0/auth0-react";

const App = ({ categoriesLoading, rulesLoading, startLoadingCategories, startLoadingRules }) => {
  useEffect(() => {
    startLoadingCategories()
    startLoadingRules()
  }, [startLoadingCategories, startLoadingRules])

  if (!categoriesLoading && !rulesLoading) {
    return (
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/upload">Upload CSV</Link>
              </li>
              <li>
                <Link to="/transactions">Transactions</Link>
              </li>
              <li>
                <Link to="/income-expenses">Income and expenses</Link>
              </li>
              <li>
                <Link to="/settings">Settings</Link>
              </li>
            </ul>
          </nav>

          <LoginButton/>
          {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/upload">
              <UploadForm/>
            </Route>
            <Route path="/transactions">
              <TransactionOverview/>
            </Route>
            <Route path="/income-expenses">
              <IncomeExpensesDashboard/>
            </Route>
            <Route path="/settings">
              <Settings/>
            </Route>
            <Route path="/">
              <Dashboard/>
            </Route>
          </Switch>
        </div>
      </Router>
    )
  } else {
    return "Loading..."
  }
}

const mapStateToProps = state => ({
  categoriesLoading: categoriesLoading(state),
  rulesLoading: rulesLoading(state),
})

const mapDispatchToProps = dispatch => ({
  startLoadingCategories: () => dispatch(loadCategories()),
  startLoadingRules: () => dispatch(loadRules())
})

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App)
export default hot(module)(ConnectedApp);

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return <button onClick={() => loginWithRedirect()}>Log In</button>;
};