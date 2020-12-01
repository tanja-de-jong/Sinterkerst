import {connect} from "react-redux"
import ListItemDescription from "./ListItemDescription"
import './ListItem.css';
import Button from "@material-ui/core/Button"
import {useRef, useState} from "react"
import {toggleCheck} from "../redux/items/thunks"
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
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
});

const ListItem = ({ item, owner, currentUser, users, toggleCheck }) => {
  const [askQuestion, setAskQuestion] = useState(false)
  const questionRef = useRef(null)

  const classes = useStyles();

  const handleCheckboxChange = (event) => {
    event.preventDefault();
    toggleCheck(item, currentUser);
  }

  const handleAsk = (event) => {
    event.preventDefault()
    setAskQuestion(true)
  }

  const checkText = item.checked ? "Zet terug" : "Streep af"

  const reAddButton = () => {
    return (
      item.checked && currentUser !== owner && currentUser === item.checkedby ?
        <div className="list-item-footer">
          <Button size="small" variant="contained" color="primary" onClick={handleCheckboxChange}>Zet terug</Button>
          {/* <Button className="check-button" variant="contained" onClick={handleCheckboxChange}>Zet terug</Button> */}
        </div> : ''
    )
  }

  const checkButton = () => {
    return (
      !item.checked && currentUser !== owner ?
        <div className="list-item-footer"> 
          <Button size="small" variant="contained" color="primary" onClick={handleCheckboxChange}>Streep af</Button>
          {/* <Button className="check-button" variant="contained" onClick={handleCheckboxChange}>Streep af</Button> */}
        </div> : ''
    )
  }

  const askButton = () => {
    return (
      currentUser !== owner ?
        <div className="list-item-footer">
          <Button className="check-button" variant="contained" onClick={handleAsk}>Stel vraag</Button>
        </div> : ''
    )
  }

  const askField = askQuestion ? <input type="text" className="form-control" placeholder="Type hier je vraag" inputRef={questionRef} /> : ''

  const description = item.description.length > 0 ? item.description : <i>Geen omschrijving toegevoegd.</i>
  const url = item.url && item.url.length > 0 ? <a href={item.url} target="_blank">{item.url}</a> : ''

  const urlElement = url === '' ? '' : <ListItemDescription description={url} />

  const listItemClassName = item.checked && currentUser !== owner ? "list-item-container checked" : "list-item-container"

  return (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <Typography className={clsx(classes.pos, {
        [classes.strike]: item.checked && currentUser !== owner,
      })} color="textPrimary">
          {item.checked && currentUser !== owner ? item.name : item.name}
              {/* <div>
                <h4 className="checked-title">{}</h4>
                <p className="checked-by">Afgestreept door: {users.find(user => user.id === item.checkedby).name}</p>
              </div> :
              <h4>{item.name}</h4>} */}
        </Typography>
          {
            item.checked && currentUser !== owner
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
      // <div className={listItemClassName}>
      //   <div className="list-item-header">
      //     <div className="list-item-title">
      //       {item.checked && currentUser !== owner ?
      //         <div>
      //           <h4 className="checked-title">{item.name}</h4>
      //           <p className="checked-by">Afgestreept door: {users.find(user => user.id === item.checkedby).name}</p>
      //         </div> :
      //         <h4>{item.name}</h4>}
      //     </div>
      //   </div>
      //   {urlElement}
      //   <ListItemDescription description={description} />
      //   <div className="list-item-footer">
      //     {reAddButton()}
      //     {checkButton()}
      //     {/*{askButton()}*/}
      //   </div>
      //   {askField}
      // </div>
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