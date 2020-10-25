import React, {useEffect, useState} from 'react'
import {getAmountRequest, getExpenses } from "../transactions/thunks"
import {connect} from "react-redux"
import {loadAccounts} from "../accounts/thunks"
import Card from "@material-ui/core/Card"
import Button from "@material-ui/core/Button"
import {KeyboardArrowLeft, KeyboardArrowRight} from "@material-ui/icons"
import {allAccounts} from "../accounts/selectors"
import SummaryCard from "../components/SummaryCard"

const Dashboard = ({getAmount, accounts, startLoadingAccounts, getExpenses}) => {
	const thisMonth = new Date()

	const [amounts, setAmounts] = useState([])
	const [selectedPeriod, setSelectedPeriod] = useState(new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1))
	const [minMonth, setMinMonth] = useState()
	const [minYear, setMinYear] = useState()
	const [maxMonth, setMaxMonth] = useState()
	const [maxYear, setMaxYear] = useState()
	const [expenses, setExpenses] = useState()

	useEffect(() => {
		startLoadingAccounts()
		getAmount(4).then(amounts => { // TODO get max and min year and month without amount
			const years = amounts.map(amount => amount.year)
			const minYear = Math.min(...years)
			const maxYear = Math.max(...years)
			setMinYear(minYear)
			setMaxYear(maxYear)

			const minMonth = Math.min(...amounts.filter(amount => amount.year === minYear).map(amount => amount.month))
			const maxMonth = Math.max(...amounts.filter(amount => amount.year === maxYear).map(amount => amount.month))
			setMinMonth(minMonth - 1)
			setMaxMonth(maxMonth - 1)

			setSelectedPeriod(new Date(maxYear, maxMonth - 1, 1))

			setAmounts(amounts)
		})
	}, [])

	useEffect(() => {
		const month = selectedPeriod.getMonth() + 1
		const start = selectedPeriod.getFullYear() + '-' + month + '-01'
		const endDate = new Date(selectedPeriod.getFullYear(), selectedPeriod.getMonth() + 1, 0)
		const end = selectedPeriod.getFullYear() + '-' + month + '-' + endDate.getDate()
		getExpenses(start, end).then(result => setExpenses(result))
	}, [selectedPeriod])

	if (!expenses) return 'Loading'

	const handleChange = (increase) => {
		const newDate = new Date(selectedPeriod)
		newDate.setMonth(newDate.getMonth() + increase)
		setSelectedPeriod(newDate)
	}

	const backButton = selectedPeriod.month === minMonth && selectedPeriod.getFullYear() === minYear
		? <Button size="small" disabled>
		<KeyboardArrowLeft />
		Back
	</Button>
		: <Button size="small" onClick={() => handleChange(-1)}>
			<KeyboardArrowLeft />
			Back
		</Button>

	const nextButton = selectedPeriod.getMonth() === maxMonth && selectedPeriod.getFullYear() === maxYear
		? <Button size="small" disabled>
			Next
			<KeyboardArrowRight />
		</Button>
		: <Button size="small" onClick={() => handleChange(1)}>
			Next
			<KeyboardArrowRight />
		</Button>

	const total = expenses.map(expense => {
		const account = accounts.find(account => expense.account === account.id)
		const factor = account.factor
		return expense.sum * factor
	} ).reduce((a,b) => a + b, 0)
	return (
		<div>
			<SummaryCard title="Uitgaven">
				{backButton}
				{selectedPeriod.toLocaleString('default', { month: 'long' })} {selectedPeriod.getFullYear()}
				{nextButton}
				{expenses.map(expense => {
					const accountDetails = accounts.find(a => a.id === expense.account)
					return <AccountCard account={accountDetails}
															amount={expense.sum}/>
				})}
				Totaal: { "€ " + total.toFixed(2).replace(".", ",") }
			</SummaryCard>
			<SummaryCard title="Leningen">
			</SummaryCard>
			<SummaryCard title="Investeringen">
			</SummaryCard>
		</div>
	)
}

const AccountCard = ({ account, amount }) => {
	console.log(amount)
	const content = "€ " + (amount ? amount * account.factor : 0).toFixed(2).replace(".", ",")

	return <div>
		<p>{account.name}</p>
		<p>{content}</p>
	</div>
}

const mapStateToProps = state => ({
	accounts: allAccounts(state)
})

const mapDispatchToProps = dispatch => ({
	getAmount: (category) => dispatch(getAmountRequest(category)),
	startLoadingAccounts: () => dispatch(loadAccounts()),
	getExpenses: (start, end) => dispatch(getExpenses(start, end))
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)