import React, {useEffect, useState} from 'react'
import TransactionList from "./TransactionList"
import {applyRules, loadTransactions} from "./thunks"
import {connect} from "react-redux"
import {allTransactions} from "./selectors"
import CategorySelector from "./CategorySelector"

const TransactionOverview = ({ transactions = [], applyRules, startLoadingTransactions }) => {
	useEffect(() => {
		startLoadingTransactions()
	}, [])


	return <div>
		<button onClick={applyRules}>Regels uitvoeren</button>
		<TransactionList transactions={transactions}  />
	</div>
}

const mapStateToProps = state => ({
	transactions: allTransactions(state),
})

const mapDispatchToProps = dispatch => ({
	applyRules: () => dispatch(applyRules()),
	startLoadingTransactions: () => dispatch(loadTransactions(1)),
})

export default connect(mapStateToProps, mapDispatchToProps)(TransactionOverview)