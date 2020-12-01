import {connect} from "react-redux"
import "./Dashboard.css"
import React from "react"
import {IconButton} from "@material-ui/core"
import {ArrowBack} from "@material-ui/icons"
import {Link, Redirect} from "react-router-dom"
import NotificationList from "./NotificationList"
import "./NotificationOverview.css"

const NotificationOverview = ({ notifications }) => {
	return (
		<div className="notification-overview-container">
			<h3>Notificaties</h3>
			<NotificationList notifications={notifications}/>
		</div>
	)
};

const mapStateToProps = state => ({
	notifications: state.logs.logs
});

export default connect(mapStateToProps, null)(NotificationOverview)