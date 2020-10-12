import React from 'react'
import './App.css';
import UploadForm from "./upload-transactions/UploadModal"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Dashboard from "./transactions/Dashboard"
import TransactionOverview from "./transactions/TransactionOverview"
import IncomeExpensesDashboard from "./income-expenses/IncomeExpensesDashboard"
import Settings from "./Settings"
import Drawer from "@material-ui/core/Drawer/Drawer"
import Toolbar from "@material-ui/core/Toolbar"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText/ListItemText"
import {makeStyles} from "@material-ui/core/styles"
import {useAuth0} from "@auth0/auth0-react"
import {withAuthenticationRequired} from "@auth0/auth0-react"

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  appBarSpacer: theme.mixins.toolbar,
  sideBarSpacer: theme.mixins.drawer,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    marginLeft: drawerWidth,
    padding: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));

const NavigationBar = () => {
  const classes = useStyles();

  return (
    <div>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <List className={classes.list} role="presentation">
            <ListItem button component={Link} to="/transactions">
              {/*<ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>*/}
              <ListItemText primary="Transacties" />
            </ListItem>
            <ListItem button component={Link} to="/overview">
              {/*<ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>*/}
              <ListItemText primary="Overzicht" />
            </ListItem>
            <ListItem button component={Link} to="/settings">
              {/*<ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>*/}
              <ListItemText primary="Instellingen" />
            </ListItem>
            <ListItem>
              <LogoutButton/>
            </ListItem>
          </List>
        </div>
      </Drawer>

      <div className={classes.content}>
        <div className={classes.appBarSpacer} />
        <div className={classes.container}>
          <Switch>
            <Route path="/upload">
              <UploadForm/>
            </Route>
            <Route path="/transactions">
              <TransactionOverview/>
            </Route>
            <Route path="/overview">
              <IncomeExpensesDashboard/>
            </Route>
            <Route path="/settings">
              <Settings/>
            </Route>
            <Route path="/login">
              <Dashboard/>
            </Route>
            <Route path="/">
              <Dashboard/>
            </Route>
            <Route path="">
              <Dashboard/>
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  )
}

export default NavigationBar

const LogoutButton = () => {
  const { logout } = useAuth0();

  return <button onClick={() => logout({ returnTo: window.location.origin })}>Log Out</button>
}