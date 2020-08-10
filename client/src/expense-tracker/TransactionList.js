import React from 'react'
import {connect} from 'react-redux'
import Transaction from "./Transaction"

const TransactionList = () => {

	const transactions = [
		{
			"description": "Dit is een testtransactie",
			"category": 0
		}
	]

	const content = transactions.map(transaction => <Transaction transaction={transaction} />)
	return (
		<div>{content}</div>
	)
}

export default TransactionList