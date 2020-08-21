import React from 'react';
import { hot } from 'react-hot-loader'
import './App.css';
import UploadForm from "./upload-transactions/UploadForm"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Dashboard from "./show-transactions/Dashboard"
import CategorySettings from "./category-settings/CategorySettings"
import TransactionOverview from "./show-transactions/TransactionOverview"
import IncomeExpensesDashboard from "./income-expenses/IncomeExpensesDashboard"

function App() {
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

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/upload">
            <UploadForm />
          </Route>
          <Route path="/transactions">
            <TransactionOverview />
          </Route>
          <Route path="/income-expenses">
            <IncomeExpensesDashboard />
          </Route>
          <Route path="/settings">
            <CategorySettings />
          </Route>
          <Route path="/">
            <Dashboard />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default hot(module)(App);
