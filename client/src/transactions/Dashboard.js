import React from 'react'
import {loadTransactions} from "./thunks"
import {connect} from "react-redux"
import {allTransactions, transactionsLoading} from "./selectors"

const Dashboard = ({ transactions = [] }) => {

	return (
		<div>
			This is your dashboard.
		</div>
	)
}

const mapStateToProps = state => ({
	transactions: allTransactions(state),
	isLoading: transactionsLoading(state)
})

export default connect(
	mapStateToProps
)(Dashboard)