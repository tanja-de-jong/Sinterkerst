import React, {useEffect, useState} from 'react'
import {connect} from "react-redux"
import {allTransactions, amounts} from "../transactions/selectors"
import moment from 'moment'
import {allCategories} from "../categories/selectors"
import {
	getAmountsRequest,
	loadTransactions,
	loadTransactionsNoPagination
} from "../transactions/thunks"
import CategorySelector from "../transactions/CategorySelector"
import {withAuthenticationRequired} from "@auth0/auth0-react"
import TransactionList from "../transactions/TransactionList"

const IncomeExpensesDashboard = ({ allCategories = [], transactions = [], amounts, getAmounts, startLoadingTransactions, startLoadingCategories, startLoadingAmounts }) => {
	const [category, setCategory] = useState()
	const [descendants, setDescendants] = useState([])
	const [loading, setLoading] = useState(false)
	const [filteredTransactions, setFilteredTransactions] = useState([])

	const getDescendantCategories = (parent) => {
		const children = allCategories.filter(category => category.parent === parent).map(child => child.id)
		const descendants = children.flatMap(child => getDescendantCategories(child))
		return children.concat(descendants)
	}

	const handleCategorySelection = (value, label) => {
		setLoading(true)
		setCategory(value)
		const descendants = getDescendantCategories(value).concat(value)
		setDescendants(descendants)
		const parentChildrenIds = descendants
		getAmounts([0, 1], parentChildrenIds).then(setLoading(false))
		startLoadingTransactions(value)
	} 

	const total = (account) => {
		const rows = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(month => <td>{totalPerMonth(account, 2020, month)}</td>)
		return <tr>
			<td>Totaal</td>
			<td>TBD</td>
			{rows}
		</tr>
	}

	const averagePerMonth = (account, categoryId) => {
		const transactionsForCategory = transactions.filter(transaction => transaction.account === account && transaction.category === categoryId)

		const firstTransactionDate = moment(Math.min(transactionsForCategory.map(transaction => parseInt(transaction.date))), "YYYYMMDD")
		const firstMonthThisYear = moment().month(0).date(1)
		const firstDate = firstTransactionDate > firstMonthThisYear ? firstTransactionDate : firstMonthThisYear
		const lastDate = moment().date(1)
		const numberOfMonths = lastDate.month() - firstDate.month()

		const sum = transactionsForCategory
			.filter(transaction => {
				const date = moment(transaction.date, "YYYYMMDD")
				return date >= firstDate && date < lastDate
			})
			.map(transaction => parseFloat(transaction.amount))
			.reduce((a, b) => a + b, 0)

		return sum / numberOfMonths
	}

	const totalPerMonth = (account, year, month) => {
		const descendantAmounts = descendants.map(desc => parseFloat(byCategoryAndPeriod(account, desc, year, month)))
		return descendantAmounts.reduce((a, b) => a + b, 0).toFixed(2)
	}

	const byCategoryAndPeriod = (account, category, year, month) => {
		const temp = amounts.find(obj => obj.account === account)
		if (!temp) console.log(account)
		const amountsForCategory = amounts.find(obj => obj.account === account).amounts.find(amount => amount.category === category)
		const amountForYear = amountsForCategory.years.find(y => y.year === year)
		const amountForMonth = amountForYear.months.find(m => m.month === month).amount
		return amountForMonth
	}

	const byCategory = (account, categoryId) => {
		const rows = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(month => <td onClick={() => setFilteredTransactions(transactions.filter(transaction => transaction.account === account && transaction.category === categoryId && moment(transaction.date, 'YYYYMMDD').month() === month && moment(transaction.date, 'YYYYMMDD').year() === 2020))}>{byCategoryAndPeriod(account, categoryId, 2020, month)}</td>)
		return <tr>
			<td>{allCategories.find(cat => cat.id === categoryId).name}</td>
			<td>{averagePerMonth(account, categoryId)}</td>
			{rows}
		</tr>
	}

	const renderAccount = (account) => {
		return <div>
			<table>
				<tbody>
				<tr>
					<th>Categorie</th>
					<th>Gemiddeld</th>
					<th>Januari</th>
					<th>Februari</th>
					<th>Maart</th>
					<th>April</th>
					<th>Mei</th>
					<th>Juni</th>
					<th>Juli</th>
					<th>Augustus</th>
					<th>September</th>
					<th>Oktober</th>
					<th>November</th>
					<th>December</th>
				</tr>
				{loading ? "Loading..." : descendants.map(desc => byCategory(account, desc))}
				{loading ? "Loading..." : total(account)}
				</tbody>
			</table>
		</div>
	}

	return <div>
		<CategorySelector onSelect={handleCategorySelection}/>
		<div>
			<button>2019</button>
			<button>2020</button>
		</div>
		<div>
			<button>Januari</button>
			<button>Februari</button>
			<button>Maart</button>
			<button>April</button>
			<button>Mei</button>
			<button>Juni</button>
			<button>Juli</button>
			<button>Augustus</button>
			<button>September</button>
			<button>Oktober</button>
			<button>November</button>
			<button>December</button>
		</div>
		<br/>
		{category
			? <div>
				Tanja
				{renderAccount(0)}
				<br/>
				Samen
				{renderAccount(1)}
			</div>
			: "No category selected"
		}
		<TransactionList transactions={filteredTransactions} />
	</div>
}

const mapStateToProps = state => ({
	allCategories: allCategories(state),
	transactions: allTransactions(state),
	amounts: amounts(state)
})

const mapDispatchToProps = dispatch => ({
	getAmounts: (accounts, category) => dispatch(getAmountsRequest(accounts, category)),
	startLoadingTransactions: (category) => dispatch(loadTransactionsNoPagination(category)),
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withAuthenticationRequired(IncomeExpensesDashboard, {
	onRedirecting: () => "Loading...",
}))