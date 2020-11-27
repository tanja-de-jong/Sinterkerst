import {connect} from "react-redux"

var React = require('react');

const ListItemDescription = ({ description }) => {
    return (
      <div className="panel-body">
        {description}
      </div>
    );
};

const mapStateToProps = state => ({
  items: state.list,
  currentUser: state.currentUser
});

export default connect(mapStateToProps)(ListItemDescription)