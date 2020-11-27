import {connect} from "react-redux"
import './UserSelection.css';
import React, {useState, useRef, useEffect} from "react"
import TextField from "@material-ui/core/TextField"
import { IconButton } from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import {selectUser} from "../redux/users/actions"

const UserSelection = ({ users, selectUser }) => {

  return (
    <div className="user-selection">
      <div className="user-group">
        {users.map(user => <UserCard key={user.id} user={user} selectUser={selectUser} />)}
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  users: state.users.users
});

const mapDispatchToProps = dispatch => ({
  selectUser: user => dispatch(selectUser(user))
});

export default connect(mapStateToProps, mapDispatchToProps)(UserSelection)

const UserCard = ({ user, selectUser }) => {
  const [selected, setSelected] = useState(false)
  const [passwordRef, setPasswordRef] = useState(null)
  const [wrapperRef, setWrapperRef] = useState(null);

  const  handleSubmit = (event) => {
    event.preventDefault();
    user.password === passwordRef.value ? selectUser(user.id) : alert("Je hebt een verkeerd wachtwoord ingevoerd.")
  }

  const useOutsideAlerter = (ref) => {
    const handleClickOutside = (event) => { if (ref && !ref.contains(event.target)) setSelected(false) }
    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return () => { document.removeEventListener("mousedown", handleClickOutside); };
    });
  }
  useOutsideAlerter(wrapperRef);

  return (
    selected ?
      (<div ref={(wrapper) => setWrapperRef(wrapper)}>
        <form className="user-card selected" onSubmit={handleSubmit}>
          <TextField type="password" variant="outlined" className="password-field" id="password" label="Wachtwoord" inputRef={(password) => setPasswordRef(password)} />
          <IconButton onClick={handleSubmit}>
            <ArrowForwardIosIcon fontSize="large" />
          </IconButton>
        </form>
      </div>)
  :
  (<div>
        <div key={user.id} className="user-card" onClick={() => setSelected(true)}>
          <p>{user.name}</p>
        </div>
      </div>)
  )
}