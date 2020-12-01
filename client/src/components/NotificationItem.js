import React from "react"
import {connect} from "react-redux"
import "./NotificationItem.css"
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';

const useStyles = makeStyles({
	root: {
	  marginBottom: 10,
	  width: '100%'
	},
	title: {
	  fontSize: 14,
	},
	pos: {
	  marginBottom: 12,
	},
	date: {
		fontStyle: 'italic',
		color: '#ababab',
		// margin: '0px 10px 10px 10px',
		fontSize: 'smaller',
	}
  });

const NotificationItem = ({ notification, items, users }) => {
	const committer = users.find(user => user.id === notification.committer)
	const item = items.find(item => item.id === notification.item)
	const owner = users.find(user => user.id === item.owner)

	const classes = useStyles();

	let dateNow = new Date()
	const dateNowNoHours = new Date(dateNow.setHours(0, 0, 0))

	const dateCreated = new Date(notification.date)
	const dateCreatedNoHours = new Date(dateCreated.setHours(0, 0, 0))

	var days = Math.abs(Math.round(dateNow - dateCreated) / (1000 * 60 * 60 * 24))
	const daysRounded = Number(days.toFixed(0))

	let text = "Voor deze actie is geen tekst beschikbaar: " + notification.type + "."
	if (notification.type === "CREATE_ITEM") {
		text = "'" + item.name + "' is toegevoegd aan " + owner.name + "'s verlanglijst."
	} else if (notification.type === "CHECK_ITEM") {
		text = "'" + item.name + "' van " + owner.name + "'s verlanglijst is afgestreept door " + committer.name + "."
	} else if (notification.type === "UNCHECK_ITEM") {
		text = "'" + item.name + "' van " + owner.name + "'s verlanglijst is teruggezet door " + committer.name + "."
	}
	let daysText = "vandaag"
	if (daysRounded === 1) { daysText = "gisteren" }
	if (daysRounded > 1) { daysText = daysRounded + " dagen geleden" }

	return (
		<Card className={classes.root} variant="outlined">
			<CardContent>
				<Typography>{text}</Typography>
				<Typography className={classes.date}>{daysText}</Typography>
			</CardContent>			
		</Card>
	)
}

const mapStateToProps = state => ({
	items: state.items.items,
	users: state.users.users
});

export default connect(mapStateToProps, null)(NotificationItem)
