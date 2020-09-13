import React from 'react'
import {loadTransactions} from "./thunks"
import {connect} from "react-redux"
import {allTransactions, transactionsLoading} from "./selectors"

const Dashboard = () => {

	return (
		<div>
			This is your dashboard.
		</div>
	)
}

export default Dashboard