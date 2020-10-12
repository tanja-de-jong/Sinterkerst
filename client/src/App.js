import React, {useEffect, useState} from 'react'
import { hot } from 'react-hot-loader'
import './App.css';
import {BrowserRouter as Router, Link} from "react-router-dom"
import AppBar from "@material-ui/core/AppBar"
import {makeStyles} from "@material-ui/core/styles"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import { createMuiTheme } from '@material-ui/core/styles';
import {ThemeProvider} from "styled-components"
import NavigationBar from "./NavigationBar"
import {useAuth0} from "@auth0/auth0-react"
import {registerFetchIntercept} from "./helper"

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

const App = () => {
  const [ tokenRegistered, setTokenRegistered ] = useState(false)
  const { loginWithRedirect, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      const register = async () => {
        const token = await getAccessTokenSilently()
        registerFetchIntercept(token)
      }

      register().then(() => {
        setTokenRegistered(true)
        }
      )
    }
  }, [isAuthenticated, getAccessTokenSilently])

  const classes = useStyles();

  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated) return loginWithRedirect()

  if (tokenRegistered) {
    return (
      <Router>
        <ThemeProvider theme={theme}>
          <div className={classes.root}>
              <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                      <Link to="/">Money Manager</Link>
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

export default hot(module)(App);