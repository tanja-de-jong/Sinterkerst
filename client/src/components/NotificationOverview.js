import {connect} from "react-redux"
import "./Dashboard.css"
import React from "react"
import {IconButton} from "@material-ui/core"
import {ArrowBack} from "@material-ui/icons"
import {Link, Redirect} from "react-router-dom"
import NotificationList from "./NotificationList"
import "./NotificationOverview.css"

const NotificationOverview = (props) => {
	console.log("NOTIFICATION OVERVIEW")
	return (
		props.currentUser === -1 ? <Redirect to='/' /> :
		<div className="notification-overview-container">
			<Link to="/">
				<IconButton>
					<ArrowBack fontSize="large"/>
				</IconButton>
			</Link>
			<div className="notification-list-container">
				<h2>Notificaties</h2>
				<NotificationList notifications={props.notifications}/>
			</div>
		</div>
	)
};

const mapStateToProps = state => ({
	notifications: state.logs.logs
});

export default connect(mapStateToProps, null)(NotificationOverview)