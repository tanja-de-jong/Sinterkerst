import React, {useEffect, useState} from 'react'
import { hot } from 'react-hot-loader'
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import {loadRules} from "./rules/thunks"
import {connect} from "react-redux"
import {loadCategories} from "./categories/thunks"
import {categoriesLoading} from "./categories/selectors"
import {rulesLoading} from "./rules/selectors"
import AppBar from "@material-ui/core/AppBar"
import IconButton from "@material-ui/core/IconButton"
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import {makeStyles} from "@material-ui/core/styles"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import { createMuiTheme } from '@material-ui/core/styles';
import orange from '@material-ui/core/colors/orange';
import {ThemeProvider} from "styled-components"
import NavigationBar from "./NavigationBar"
import {useAuth0} from "@auth0/auth0-react"

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: "#4ba3c3"
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
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
}));

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#4ba3c3'
    },
    secondary: {
      main: '#ffcab1'
    }
  }
});

const App = ({ categoriesLoading, rulesLoading, startLoadingCategories, startLoadingRules }) => {
  useEffect(() => {
    startLoadingCategories()
    startLoadingRules()
  }, [startLoadingCategories, startLoadingRules])
  const classes = useStyles();

  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated) return <div><LoginScreen /></div>

  if (!categoriesLoading && !rulesLoading) {
    return (
      <Router>
      <ThemeProvider theme={theme}>
        <div className={classes.root}>
            <AppBar position="fixed" className={classes.appBar}>
              <Toolbar>
                  <Typography variant="h6" className={classes.title}>
                    Money Manager
                  </Typography>
              </Toolbar>
            </AppBar>
          <NavigationBar />
        </div>
      </ThemeProvider>
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

const LoginScreen = () => {
  return <LoginButton/>
}

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return <button onClick={() => loginWithRedirect()}>Log In</button>;
}