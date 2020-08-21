import React, {useEffect} from 'react'
import {loadTransactions} from "../show-transactions/thunks"
import {connect} from "react-redux"

const IncomeExpensesDashboard = ({ categories = [], transactions = [], isLoading, startLoadingTransactions }) => {

	useEffect(() => {
		startLoadingTransactions()
	}, [])

	const totalAmountPerCategory = categoryId => {
		const filteredAmounts = transactions.filter(transaction => transaction.category === categoryId).map(transaction => parseInt(transaction.amount))
		const sum = filteredAmounts.reduce((a,b) => a + b, 0)
		debugger
		return sum
	}

	const totalAmount = categories.map(category => {
		return (
			<div>
				{category.name}: {totalAmountPerCategory(category.id)}
			</div>
		)
	})

	return (
		<div>
			Total: {totalAmount}
		</div>
	)
}

const mapStateToProps = state => ({
	categories: state.categories,
	transactions: state.transactions,
	isLoading: state.isLoading
})

const mapDispatchToProps = dispatch => ({
	startLoadingTransactions: () => dispatch(loadTransactions())
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(IncomeExpensesDashboard)