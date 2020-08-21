import React from 'react'
import Transaction from "./Transaction"

const TransactionList = ({ transactions = [] }) => {

	debugger
	const content = transactions.map(transaction => <Transaction key={transaction.id} transaction={transaction} />)
	return (
		<div>{content}</div>
	)
}

export default TransactionList