import {connect, useDispatch} from "react-redux"
import ShoppingList from "./ShoppingList"
import UserButtons from "./UserButtons"
import UserSelection from "./UserSelection"
import NotificationsIcon from '@material-ui/icons/Notifications'
import {IconButton} from "@material-ui/core"
import "./Dashboard.css"
import React, {useEffect, useState} from "react"
import {Link} from "react-router-dom"
import NotificationList from "./NotificationList"
import {fetchUsers} from "../redux/users/thunks"
import {fetchLogs, updateLog} from "../redux/logs/thunks"

const Dashboard = ({ users, usersLoading, currentUser, notifications, fetchUsers, fetchLogs, updateLog }) => {
	const [showNotifications, setShowNotifications] = useState(false)
	const dispatch = useDispatch()

	useEffect(() => {
		fetchUsers()
		fetchLogs()
	}, [])

	const handleClick = () => {
		updateLog(currentUser)
		setShowNotifications(!showNotifications)
	}

  if (!users || !users.length) {
    return <div>Loading</div>
  } else {
  	if (currentUser === -1) {
			return <UserSelection/>
		} else {
			const user = users.find(user => user.id === currentUser)
			const otherUsers = users.filter(user => user.id !== currentUser)

      return <div>
        <UserButtons users={otherUsers}/>

				<div className="notifications-button">
					<IconButton onClick={handleClick}>
						<NotificationsIcon fontSize="large"/>
					</IconButton>
				</div>

				<NotificationFlyout show={showNotifications} notifications={notifications} user={user}/>

        <ShoppingList owner={currentUser}/>
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

