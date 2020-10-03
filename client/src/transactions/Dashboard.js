import React, {useEffect, useState} from 'react'
import {getAmountRequest, getRowsRequest, loadTransactions} from "./thunks"
import {connect} from "react-redux"
import {allTransactions, pages, transactionsLoading} from "./selectors"
import {useAuth0} from "@auth0/auth0-react"
import {loadAccounts} from "../accounts/thunks"
import {loadCategories} from "../categories/thunks"
import Card from "@material-ui/core/Card"
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight'
import MobileStepper from "@material-ui/core/MobileStepper"
import Button from "@material-ui/core/Button"
import {KeyboardArrowLeft, KeyboardArrowRight} from "@material-ui/icons"
import {allCategories} from "../categories/selectors"
import {allAccounts} from "../accounts/selectors"

const Dashboard = ({getAmount, accounts, startLoadingAccounts}) => {
	const [amounts, setAmounts] = useState([])
	const [selectedPeriod, setSelectedPeriod] = useState(new Date())
	const [minMonth, setMinMonth] = useState()
	const [minYear, setMinYear] = useState()
	const [maxMonth, setMaxMonth] = useState()
	const [maxYear, setMaxYear] = useState()

	useEffect(() => {
		startLoadingAccounts()
		getAmount(4).then(amounts => {
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

	if (amounts) {
		const handleChange = (increase) => {
			const newDate = new Date(selectedPeriod)
			newDate.setMonth(newDate.getMonth() + increase)
			setSelectedPeriod(newDate)
		}

		const backButton = selectedPeriod.getMonth() === minMonth && selectedPeriod.getFullYear() === minYear
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

		const amountsForMonth = amounts.filter(amount => amount.month === selectedPeriod.getMonth() + 1 && amount.year === selectedPeriod.getFullYear())
		const total = amountsForMonth.map(amount => {
			const account = accounts.find(account => amount.account === account.id)
			const factor = account.factor
			return amount.sum * factor
		} ).reduce((a,b) => a + b, 0)
		return (
			<div>
				<Card variant="outlined">
					Uitgaven
					{backButton}
					{selectedPeriod.toLocaleString('default', { month: 'long' })} {selectedPeriod.getFullYear()}
					{nextButton}
					{accounts.map(account => <AccountCard account={account} amount={amountsForMonth.find(amount => amount.account === account.id)} />)}
					Totaal: { "€ " + total.toFixed(2).replace(".", ",") }
				</Card>
				<Card variant="outlined">
					Leningen
				</Card>
				<Card variant="outlined">
					Investeringen
				</Card>
			</div>
		)
	}
}

const AccountCard = ({ account, amount }) => {
	const content = "€ " + (amount ? amount.sum * account.factor : 0).toFixed(2).replace(".", ",")

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
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)