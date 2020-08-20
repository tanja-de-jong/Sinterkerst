import React from 'react'
import {connect} from 'react-redux'
import Transaction from "./Transaction"

const TransactionList = ({ transactions }) => {

	const content = transactions.map(transaction => <Transaction key={transaction.id} transaction={transaction} />)
	return (
		<div>{content}</div>
	)
}

export default TransactionList