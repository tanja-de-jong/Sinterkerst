import {connect} from "react-redux"
import "./Dashboard.css"
import React from "react"
import NotificationItem from "./NotificationItem"

const NotificationList = ({ notifications, items, users, currentUser, limit}) => {
	const filteredNotifications = notifications.filter(notification => {
		const item = items.find(item => item.id === notification.item)
		console.log("Item")
		console.log(notification)
		console.log(item)
		const owner = users.find(user => user.id === item.owner)
		return owner.id !== currentUser && notification.committer !== currentUser
	})
	let limitedNotifications = filteredNotifications
	if (limit && limitedNotifications.length > limit) limitedNotifications = filteredNotifications.slice(filteredNotifications.length - limit, filteredNotifications.length)

	return (
		<div>
			{limitedNotifications.reverse().map(notification => <NotificationItem key={notification.id} notification={notification} />)}
		</div>
	)
};

const mapStateToProps = state => ({
	items: state.items.items,
  users: state.users.users,
	currentUser: state.users.currentUser
});

export default connect(mapStateToProps, null)(NotificationList)