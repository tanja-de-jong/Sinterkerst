import AddListItem from "./AddListItem"
import {connect} from "react-redux"
import List from "./List"
import './ShoppingList.css';

var React = require('react');

const ShoppingList = ({ owner, currentUser }) => {
  return (
    <div className="shopping-list">
      <List owner={owner}/>
      {
        currentUser === owner ?
          <div className="column">
            <AddListItem owner={owner}/>
          </div> : ''
      }
    </div>
  )
}

const mapStateToProps = state => ({
  currentUser: state.users.currentUser
});

const ConnectedShoppingList = connect(mapStateToProps)(ShoppingList)
export default ConnectedShoppingList
