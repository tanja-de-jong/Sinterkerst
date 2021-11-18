import {connect} from "react-redux"
import List from "./List"
import MenuIcon from '@material-ui/icons/Menu';
import UserSelection from "./UserSelection"
import NotificationsIcon from '@material-ui/icons/Notifications'
import AddIcon from '@material-ui/icons/Add';
import {IconButton} from "@material-ui/core"
import "./Dashboard.css"
import React, {useEffect, useState} from "react"
import {Link} from "react-router-dom"
import NotificationList from "./NotificationList"
import Menu from "./Menu"
import {fetchUsers} from "../redux/users/thunks"
import {fetchLogs} from "../redux/logs/thunks"
import AddListItem from "./AddListItem"

const Dashboard = ({ users, currentUser, fetchUsers, fetchLogs }) => {
	const [menuOpen, setMenuOpen] = useState(false)
	const [addDialogOpen, setAddDialogOpen] = useState(false)
	const [listOwner, setListOwner] = useState(currentUser)

	useEffect(() => {
		fetchUsers()
		fetchLogs()
	}, [])


  if (!users || !users.length) {
    return <div>Loading</div>
  } else {
  	if (currentUser === -1) {
		return <UserSelection/>
	} else {
		const otherUsers = users.filter(user => user.id !== currentUser)
		// const content = listOwner === -1 ? <NotificationList /> : <List listOwner={listOwner} />

      	return <div className="dashboard">
			<IconButton onClick={() => setMenuOpen(!menuOpen)}>
				<MenuIcon fontSize="large"/>
			</IconButton>
			<Menu open={menuOpen} setOpen={setMenuOpen} users={otherUsers} currentUser={currentUser} handleUserSelection={setListOwner} />

			<div className="notifications-button">
				<IconButton onClick={() => setListOwner(-1)}>
					<NotificationsIcon fontSize="large"/>
				</IconButton>
				<IconButton onClick={() => setAddDialogOpen(!addDialogOpen)}>
					<AddIcon fontSize="large"/>
				</IconButton>
			</div>

			<AddListItem open={addDialogOpen} setOpen={setAddDialogOpen} /> 

			{/* <div className="content">{content}</div> */}
		</div>
	}
  }
}

const mapStateToProps = state => ({
  	users: state.users.users,
	usersLoading: state.users.loading,
  	currentUser: state.users.currentUser,
});

const mapDispatchToProps = dispatch => ({
  fetchUsers: () => dispatch(fetchUsers()),
  fetchLogs: () => dispatch(fetchLogs()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)