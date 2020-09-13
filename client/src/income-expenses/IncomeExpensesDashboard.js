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

const IncomeExpensesDashboard = ({ allCategories = [], transactions = [], amounts, getAmounts, startLoadingTransactions }) => {

	// useEffect(() => {
	// 	debugger
	// 	getAmounts("22ofrnfYO")
	// })

	const [category, setCategory] = useState()
	const [descendants, setDescendants] = useState([])
	const [loading, setLoading] = useState(false)

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
		getAmounts(parentChildrenIds).then(setLoading(false))
		startLoadingTransactions(value)
	}

	const total = () => {
		return <tr>
			<td>Totaal</td>
			<td>TBD</td>
			<td>{totalPerMonth(2020, 0)}</td>
			<td>{totalPerMonth(2020, 1)}</td>
			<td>{totalPerMonth(2020, 2)}</td>
			<td>{totalPerMonth(2020, 3)}</td>
			<td>{totalPerMonth(2020, 4)}</td>
			<td>{totalPerMonth(2020, 5)}</td>
			<td>{totalPerMonth(2020, 6)}</td>
			<td>{totalPerMonth(2020, 7)}</td>
			<td>{totalPerMonth(2020, 8)}</td>
			<td>{totalPerMonth(2020, 9)}</td>
			<td>{totalPerMonth(2020, 10)}</td>
			<td>{totalPerMonth(2020, 11)}</td>
		</tr>
	}

	const averagePerMonth = (categoryId) => {
		const transactionsForCategory = transactions.filter(transaction => transaction.category === categoryId)

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
debugger
		return sum / numberOfMonths
	}

	const totalPerMonth = (year, month) => {
		const descendantAmounts = descendants.map(desc => parseFloat(byCategoryAndPeriod(desc, year, month)))
		return descendantAmounts.reduce((a, b) => a + b, 0).toFixed(2)
	}

	const byCategoryAndPeriod = (category, year, month) => {
		const amountsForCategory = amounts.find(amount => amount.category === category)
		debugger
		const amountForYear = amountsForCategory.years.find(y => y.year === year)
		const amountForMonth = amountForYear.months.find(m => m.month === month).amount
		return amountForMonth
	}

	const byCategory = (categoryId) => {
		return <tr>
			<td>{allCategories.find(cat => cat.id === categoryId).name}</td>
			<td>{averagePerMonth(categoryId)}</td>
			<td>{byCategoryAndPeriod(categoryId, 2020, 0)}</td>
			<td>{byCategoryAndPeriod(categoryId, 2020, 1)}</td>
			<td>{byCategoryAndPeriod(categoryId, 2020, 2)}</td>
			<td>{byCategoryAndPeriod(categoryId, 2020, 3)}</td>
			<td>{byCategoryAndPeriod(categoryId, 2020, 4)}</td>
			<td>{byCategoryAndPeriod(categoryId, 2020, 5)}</td>
			<td>{byCategoryAndPeriod(categoryId, 2020, 6)}</td>
			<td>{byCategoryAndPeriod(categoryId, 2020, 7)}</td>
			<td>{byCategoryAndPeriod(categoryId, 2020, 8)}</td>
			<td>{byCategoryAndPeriod(categoryId, 2020, 9)}</td>
			<td>{byCategoryAndPeriod(categoryId, 2020, 10)}</td>
			<td>{byCategoryAndPeriod(categoryId, 2020, 11)}</td>
		</tr>
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
		{category
			? <div>
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
					{loading ? "Loading..." : descendants.map(desc => byCategory(desc))}
					{loading ? "Loading..." : total()}
					</tbody>
				</table>
			</div>
			: "No category selected"
		}
	</div>
}

const mapStateToProps = state => ({
	allCategories: allCategories(state),
	transactions: allTransactions(state),
	amounts: amounts(state)
})

const mapDispatchToProps = dispatch => ({
	getAmounts: (category) => dispatch(getAmountsRequest(category)),
	startLoadingTransactions: (category) => dispatch(loadTransactionsNoPagination(category)),
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withAuthenticationRequired(IncomeExpensesDashboard, {
	onRedirecting: () => "Loading...",
}))