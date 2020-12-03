import React from "react"
import {connect} from "react-redux"
import "./NotificationItem.css"
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import cx from 'classnames';

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
	},
	unread: {
		backgroundColor: '#ffffed'
	}
  });

const NotificationItem = ({ notification, items, users, lastLogId }) => {
	const committer = users.find(user => user.id === notification.committer)
	const item = items.find(item => item.id === notification.item)
	const owners = users.filter(user => item.owners.includes(user.id))

	const classes = useStyles();

	let dateNow = new Date()
	const dateNowNoHours = new Date(dateNow.setHours(0, 0, 0))

	const dateCreated = new Date(notification.date)
	const dateCreatedNoHours = new Date(dateCreated.setHours(0, 0, 0))

	var days = Math.abs(Math.round(dateNow - dateCreated) / (1000 * 60 * 60 * 24))
	const daysRounded = Number(days.toFixed(0))

	const ownersArrayToString = () => {
		if (owners.length === 0) {
			return ''
		} else if (owners.length === 1) {
			return 'de verlanglijst van ' + owners[0].name
		} else {
			let result = 'de verlanglijsten van ' + owners[0].name
			for (let i = 1; i < owners.length - 1; i++) {
				result += ', ' + owners[i].name
			}
			result += ' en ' +  owners[owners.length - 1].name
			return result
		}
	}

	let text = "Voor deze actie is geen tekst beschikbaar: " + notification.type + "."
	if (notification.type === "CREATE_ITEM") {
		text = "'" + item.name + "' is toegevoegd aan " + ownersArrayToString() + "."
	} else if (notification.type === "CHECK_ITEM") {
		text = "'" + item.name + "' van " + ownersArrayToString() + " is afgestreept door " + committer.name + "."
	} else if (notification.type === "UNCHECK_ITEM") {
		text = "'" + item.name + "' van " + ownersArrayToString() + " is teruggezet door " + committer.name + "."
	}
	let daysText = "vandaag"
	if (daysRounded === 1) { daysText = "gisteren" }
	if (daysRounded > 1) { daysText = daysRounded + " dagen geleden" }

	return (
		<Card className={cx(classes.root, {
			[classes.unread]: notification.id > lastLogId,
		  })} variant="outlined">
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
