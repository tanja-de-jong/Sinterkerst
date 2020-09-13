import React from 'react'
import './Transaction.css'
import moment from 'moment'
import 'moment/locale/nl'
import CategorySelector from "./CategorySelector"
import {setCategoryRequest} from "./thunks"
import {connect} from "react-redux"

const Transaction = ({ transaction, setCategory }) => {

	const account = transaction.account === "NL74INGB0654972370" ? "Tanja" : "Samen"

	return (
		<div className="transaction">
			<div><CategorySelector selected={transaction.category} debitOrCredit={transaction.debitOrCredit} onSelect={(category) => setCategory(transaction.id, category)}/></div>
			<p className="transaction-description">{account}</p>
			<p className="transaction-description">{transaction.description}</p>
			<p className="transaction-description">{moment(transaction.date, "YYYYMMDD").locale("nl").format("DD MMMM YYYY")}</p>
			<p className="transaction-description">{transaction.amount}</p>
			<p className="transaction-description">{transaction.debitOrCredit}</p>
			<p className="transaction-description">{transaction.remarks}</p>
		</div>
	)
}

const mapDispatchToProps = dispatch => ({
	setCategory: (transactionId, categoryId) => dispatch(setCategoryRequest(transactionId, categoryId))
})

export default connect(null, mapDispatchToProps)(Transaction)