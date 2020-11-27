import {connect} from "react-redux"
import {Link} from "react-router-dom"
import Button from "@material-ui/core/Button"
import "./UserButtons.css"
import {selectUser} from "../redux/users/actions"

var React = require('react');

const UserButtons = (props) => {
  const buttons = props.users.map(user => {
    return (
      <Link to={"/list/" + user.id} key={user.id} className="user-button">
        <Button style={{fontSize: 12}} type="submit">{user.name}</Button>
      </Link>
    )
  })

  return (
    <div className="form-group">
      {buttons}
      <Button type="reset"  style={{fontSize: 12}} className="btn btn-primary" onClick={() => props.selectUser(-1)}>Log uit</Button>
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  selectUser: user => dispatch(selectUser(user))
});

export default connect(null, mapDispatchToProps)(UserButtons)
