import {connect} from "react-redux"
import ListItem from "./ListItem"
import ListHeader from "./ListHeader"
import './List.css';
import {useEffect} from "react"
import {fetchItems} from "../redux/items/thunks"
var React = require('react');

const List = ({ listOwner, allItems, fetchItems }) => {
  useEffect(() => {
    fetchItems()
  }, [])

  if (allItems) {
    const items = allItems.filter(item => item.owners.includes(listOwner))
    const listItemElements = items.map(item => <ListItem item={item} listOwner={listOwner} key={item.id} />)

    return (
      <div className="list-div">
        <h3 className="page-header">

          <ListHeader totalNumberOfListItems={3} listOwner={listOwner}/>

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
