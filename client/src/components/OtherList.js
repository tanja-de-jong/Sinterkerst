import ShoppingList from "./ShoppingList"
import {IconButton} from "@material-ui/core"
import "./Dashboard.css"
import {ArrowBack} from "@material-ui/icons"
import {Link, Redirect} from "react-router-dom"
import {connect} from "react-redux"

var React = require('react');

const OtherList = (props) => {
  return (
    props.currentUser === -1 ? <Redirect to='/' /> :
    <div>
      <div>
        <Link to="/">
          <IconButton>
            <ArrowBack fontSize="large"/>
          </IconButton>
        </Link>
      </div>
      <ShoppingList owner={props.owner}/>
    </div>
  )
}

const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});

export default connect(mapStateToProps, null)(OtherList)
