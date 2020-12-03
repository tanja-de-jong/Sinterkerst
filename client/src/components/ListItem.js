import {connect} from "react-redux"
import './ListItem.css';
import Button from "@material-ui/core/Button"
import {toggleCheck} from "../redux/items/thunks"
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import LinkIcon from '@material-ui/icons/Link';
var React = require('react');

const useStyles = makeStyles({
  root: {
    marginBottom: 10,
    width: '100%'
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  strike: {
    textDecoration: 'line-through'
  },
  togetherDiv: {
    color: '#ababab',
    fontSize: 'small'
  },
  connector: {
    verticalAlign: 'middle'
  }
});

const ListItem = ({ item, listOwner, currentUser, users, toggleCheck }) => {
  const classes = useStyles();

  const handleCheckboxChange = (event) => {
    event.preventDefault();
    toggleCheck(item, currentUser);
  }

  const reAddButton = () => {
    return (
      item.checked && !item.owners.includes(currentUser) && currentUser === item.checkedby ?
        <div className="list-item-footer">
          <Button size="small" variant="contained" color="primary" onClick={handleCheckboxChange}>Zet terug</Button>
        </div> : ''
    )
  }

  const checkButton = () => {
    return (
      !item.checked && !item.owners.includes(currentUser) ?
        <div className="list-item-footer"> 
          <Button size="small" variant="contained" color="primary" onClick={handleCheckboxChange}>Streep af</Button>
        </div> : ''
    )
  }

  const ownersArrayToString = (owners) => {
    let result = owners[0]
    for (let i = 1; i < owners.length - 1; i++) {
      result += ', ' + owners[i]
    }
    if (owners.length > 1) result += ' en ' +  owners[owners.length - 1]
    return result
  }
  
  const description = item.description.length > 0 ? item.description : <i>Geen omschrijving toegevoegd.</i>
  const url = item.url && item.url.length > 0 ? <a href={item.url} target="_blank">{item.url}</a> : ''
  const otherOwners = item.owners.filter(owner => owner !== listOwner).map(owner => users.find(user => user.id === owner).name)
  const together = item.owners.length > 1 ? <div className={classes.togetherDiv}><LinkIcon fontSize="small" className={classes.connector}/> Samen met { ownersArrayToString(otherOwners) }</div> : ''

  return (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <Typography className={clsx(classes.pos, {
        [classes.strike]: item.checked && !item.owners.includes(currentUser),
      })} color="textPrimary">
          {item.checked && !item.owners.includes(currentUser) ? item.name : item.name}
        </Typography>
        {together}
          {
            item.checked && !item.owners.includes(currentUser)
              ? <Typography color="textSecondary">
                  Afgestreept door: { users.find(user => user.id === item.checkedby).name }
                </Typography>
              : ''
          }
        <Typography variant="body2" component="p">
          {url}
        </Typography>
        <Typography variant="body2" component="p">
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        {checkButton()}
        {reAddButton()}
      </CardActions>
    </Card>
  )
}

const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
  users: state.users.users
});

const mapDispatchToProps = dispatch => ({
  toggleCheck: (item, buyerId) => dispatch(toggleCheck(item, buyerId))
});

const ConnectedListItem = connect(mapStateToProps, mapDispatchToProps)(ListItem)
export default ConnectedListItem