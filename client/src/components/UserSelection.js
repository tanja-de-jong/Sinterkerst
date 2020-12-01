import {connect} from "react-redux"
import './UserSelection.css';
import React, {useState, useRef, useEffect} from "react"
import TextField from "@material-ui/core/TextField"
import { IconButton } from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import {selectUser} from "../redux/users/actions"
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

const useStyles = makeStyles({
  button: {
    height: '50px',
    width: '250px',
    marginBottom: 10,
    fontSize: 'large'
  },
  password: {
    height: '50px',
    width: '200px',
    marginBottom: 10,
    fontSize: 'large'
  },
});

const UserSelection = ({ users, selectUser }) => {
  const [userSelected, setUserSelected] = useState(-1)
  const [password, setPassword] = useState('')

  const login = (user) => {
    user.password === password ? selectUser(user.id) : alert("Je hebt een verkeerd wachtwoord ingevoerd.")
  }

  const classes = useStyles();
  const userButtons = users.map(user => 
    userSelected === user.id
      ? <div key={user.id}>
          <TextField
            autoFocus
            className={classes.password}
            id="standard-password-input"
            onChange={event => setPassword(event.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") login(user) }}
            label="Password"
            type="password"
            autoComplete="current-password"
            variant="filled"
            color="primary"
          />
          <IconButton onClick={() => login(user)}>
            <ArrowForwardIosIcon />
          </IconButton>
        </div>
      : <Button key={user.id}
          className={classes.button}
          color="primary"
          variant="contained"
          onClick={() => setUserSelected(user.id)}
        >
          {user.name}
        </Button>
  )

  return (
    <div className="user-selection">
        {userButtons}
    </div>
  );
};

const mapStateToProps = state => ({
  users: state.users.users
});

const mapDispatchToProps = dispatch => ({
  selectUser: user => dispatch(selectUser(user))
});

export default connect(mapStateToProps, mapDispatchToProps)(UserSelection)