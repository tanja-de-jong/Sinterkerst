import React from 'react'
import {makeStyles} from "@material-ui/core/styles"
import Card from "@material-ui/core/Card"

const useStyles = makeStyles((theme) => ({
	card: {
		borderRadius: '25px',
		width: '250px',
		height: '250px',
		padding: '10px',
		margin: '10px'
	},
}))

const SummaryCard = ({ title, children }) => {
	const classes = useStyles();


	return (
		<Card className={classes.card}>
			<h3>{title}</h3>
			{children}
		</Card>
	)
}

export default SummaryCard