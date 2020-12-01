import {connect, useDispatch} from "react-redux"
import ShoppingList from "./ShoppingList"
import UserButtons from "./UserButtons"
import MenuIcon from '@material-ui/icons/Menu';
import UserSelection from "./UserSelection"
import NotificationOverview from "./NotificationOverview"
import NotificationsIcon from '@material-ui/icons/Notifications'
import AddIcon from '@material-ui/icons/Add';
import {IconButton} from "@material-ui/core"
import "./Dashboard.css"
import React, {useEffect, useState} from "react"
import {Link} from "react-router-dom"
import NotificationList from "./NotificationList"
import Menu from "./Menu"
import {fetchUsers} from "../redux/users/thunks"
import {fetchLogs, updateLog} from "../redux/logs/thunks"
import AddListItem from "./AddListItem"

const Dashboard = ({ users, usersLoading, currentUser, notifications, fetchUsers, fetchLogs, updateLog }) => {
	const [menuOpen, setMenuOpen] = useState(false)
	const [addDialogOpen, setAddDialogOpen] = useState(false)
	const [list, setList] = useState(currentUser)

	useEffect(() => {
		fetchUsers()
		fetchLogs()
	}, [])

	const handleClick = () => {
		updateLog(currentUser)
		setList(-1)
	}

  if (!users || !users.length) {
    return <div>Loading</div>
  } else {
  	if (currentUser === -1) {
		return <UserSelection/>
	} else {
		const otherUsers = users.filter(user => user.id !== currentUser)
		const content = list === -1 ? <NotificationOverview /> : <ShoppingList owner={list} dialogOpen={addDialogOpen} setDialogOpen={setAddDialogOpen} />

      	return <div className="dashboard">
			<IconButton onClick={() => setMenuOpen(!menuOpen)}>
				<MenuIcon fontSize="large"/>
			</IconButton>
			<Menu open={menuOpen} setOpen={setMenuOpen} users={otherUsers} currentUser={currentUser} handleUserSelection={setList} />

			<div className="notifications-button">
				<IconButton onClick={handleClick}>
					<NotificationsIcon fontSize="large"/>
				</IconButton>
				<IconButton onClick={() => setAddDialogOpen(!addDialogOpen)}>
					<AddIcon fontSize="large"/>
				</IconButton>
			</div>

			<AddListItem owner={currentUser} open={addDialogOpen} setOpen={setAddDialogOpen} /> 

			<div className="content">{content}</div>
		</div>
	}
  }
}

const mapStateToProps = state => ({
  users: state.users.users,
	usersLoading: state.users.loading,
  currentUser: state.users.currentUser,
	notifications: state.logs.logs,
});

const mapDispatchToProps = dispatch => ({
  fetchUsers: () => dispatch(fetchUsers()),
  fetchLogs: () => dispatch(fetchLogs()),
  updateLog: (userId) => dispatch(updateLog(userId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)

const NotificationFlyout = ({show, notifications}) => {
	// TODO: filter notifications by user
	return (
		show ?
			<div className="notifications-flyout">
				<NotificationList notifications={notifications} limit={10}/>
				<div className="show-all-button-container"><Link to="/updates">Toon alles</Link></div>
			</div> :
			''
	)
}

