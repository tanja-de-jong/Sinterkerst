import {connect} from "react-redux"
import {selectUser} from "../redux/users/actions"
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import { makeStyles } from '@material-ui/core/styles';
import {Link} from "react-router-dom"


var React = require('react');

const useStyles = makeStyles({
  list: {
    width: 150,
  },
  fullList: {
    width: 'auto',
  },
});

const Menu = ({ users, currentUser, open, setOpen, handleUserSelection, selectUser }) => {
  const classes = useStyles();

  return (
    <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
      <div className={classes.list} onClick={() => setOpen(false)}>
        <List>
          <ListItem button onClick={() => handleUserSelection(currentUser)}>
            <ListItemText primary="Eigen lijst" />
          </ListItem>
        </List>
        <Divider />
        <List>
          {
            users.map((user, id) => (
              <ListItem button key={id} onClick={() => handleUserSelection(user.id)}>
                <ListItemText primary={user.name} />
              </ListItem>
            ))
          }
        </List>
        <Divider />
        <List>
          <ListItem button onClick={() => {
            handleUserSelection(currentUser)
            selectUser(-1)
          }}>
            <ListItemText primary="Log uit" />
          </ListItem>
        </List>
      </div>
    </Drawer>
  );
};

const mapDispatchToProps = dispatch => ({
  selectUser: user => dispatch(selectUser(user))
});

export default connect(null, mapDispatchToProps)(Menu)
