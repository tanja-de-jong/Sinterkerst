import React, {useEffect} from 'react'
import TransactionList from "./TransactionList"
import {loadTransactions} from "./thunks"
import {connect} from "react-redux"

const TransactionOverview = ({ transactions = [], startLoadingTransactions }) => {
	useEffect(() => {
		startLoadingTransactions()
	}, [])

	debugger
	return <TransactionList transactions={transactions} />
}

const mapStateToProps = state => ({
	transactions: state.transactions,
})

const mapDispatchToProps = dispatch => ({
	startLoadingTransactions: () => dispatch(loadTransactions()),
})

export default connect(mapStateToProps, mapDispatchToProps)(TransactionOverview)