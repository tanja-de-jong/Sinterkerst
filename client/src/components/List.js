import {connect} from "react-redux"
import ListItem from "./ListItem"
import ListHeader from "./ListHeader"
import './List.css';
import {useEffect} from "react"
import {fetchItems} from "../redux/items/thunks"
var React = require('react');

const List = ({ owner, allItems, fetchItems }) => {
  useEffect(() => {
    fetchItems()
  }, [])

  if (allItems) {
    const items = allItems.filter(item => item.owner === owner)
    const listItemElements = items.map(item => <ListItem item={item} key={item.id} owner={owner}/>)

    return (
      <div className="list-div">
        <h3 className="page-header">

          <ListHeader totalNumberOfListItems={3} owner={owner}/>

        </h3>
        <div className="item-list">

          {listItemElements.length > 0 ? listItemElements : <div>
            Er staat nog niets in deze verlanglijst.
          </div>}

        </div>
      </div>
    )
  } else {
    return "Loading..."
  }
}

const mapStateToProps = state => ({
  allItems: state.items.items
});

const mapDispatchToProps = dispatch => ({
  fetchItems: () => dispatch(fetchItems())
})

const ConnectedList = connect(mapStateToProps, mapDispatchToProps)(List)
export default ConnectedList
