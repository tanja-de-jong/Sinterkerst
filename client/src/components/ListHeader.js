import {connect} from "react-redux"

var React = require('react');

const ListHeader = (props) => {
  var totalNumberOfListItems = props.totalNumberOfListItems;

  return (
    <span>Verlanglijst van {props.users.find(user => user.id === props.listOwner).name}</span>
  )
}

const mapStateToProps = state => ({
  users: state.users.users
});

export default connect(mapStateToProps, null)(ListHeader)