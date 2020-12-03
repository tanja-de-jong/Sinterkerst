import {connect} from "react-redux"
import "./Dashboard.css"
import React, {useEffect} from "react"
import NotificationItem from "./NotificationItem"
import {updateLog} from "../redux/logs/thunks"

const NotificationList = ({ notifications, items, users, currentUser, updateLog}) => {
	
	useEffect(() => {
		updateLog(currentUser)
	}, [])

	const filteredNotifications = notifications.filter(notification => {
		const item = items.find(item => item.id === notification.item)
		const ownerIds = users.filter(user => item.owners.includes(user.id)).map(user => user.id)
		return !ownerIds.includes(currentUser) && notification.committer !== currentUser
	})

	const currentUserLog = users.find(user => user.id === currentUser).log
	return (
		<div className="notification-overview-container">
			<h3>Notificaties</h3>
			{filteredNotifications.reverse().map(notification => <NotificationItem key={notification.id} notification={notification} lastLogId={currentUserLog} />)}
		</div>
	)
};

const mapStateToProps = state => ({
	items: state.items.items,
  	users: state.users.users,
	currentUser: state.users.currentUser,
	notifications: state.logs.logs
});

const mapDispatchToProps = dispatch => ({
	updateLog: (userId) => dispatch(updateLog(userId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NotificationList)