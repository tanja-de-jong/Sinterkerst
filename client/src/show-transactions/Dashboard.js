import React, {useEffect} from 'react'
import {loadTransactions} from "./thunks"
import {connect} from "react-redux"

const Dashboard = ({ transactions = [], isLoading, startLoadingTransactions }) => {

	useEffect(() => {
		startLoadingTransactions()
	}, [])

	return (
		<div>
			This is your dashboard.
		</div>
	)
}

const mapStateToProps = state => ({
	transactions: state.transactions,
	isLoading: state.isLoading
})

const mapDispatchToProps = dispatch => ({
	startLoadingTransactions: () => dispatch(loadTransactions())
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Dashboard)