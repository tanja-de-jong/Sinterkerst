import React, {useState} from 'react'
import {connect} from 'react-redux'
import Select from 'react-select'
import './Transaction.css'
import moment from 'moment'
import 'moment/locale/nl'
import {uploadFile} from "../upload-transactions/thunks"
import {clearNewTransactions} from "../upload-transactions/actions"
import {setCategoryRequest} from "./thunks"

const Transaction = ({ transaction, categories, setCategory }) => {

	const categoriesAsOptions = categories.map(category => {
		const parent = categories.find(parent => parent.id === category.parent)
		let label = category.name
		if (parent) {
			label = label + " (" + parent.name + ")"
		}
		return {
			"value": category.id,
			"label": label
		}
	})

	const categoryAsObject = () => {
		return (
			transaction.category
				? {
					"value": transaction.category,
					"label": categoriesAsOptions.find(category => category.value === transaction.category).label
				}
				: null
		)
	}

	return (
		<div className="transaction">
			<p className="transaction-description">{transaction.description}</p>
			<p className="transaction-description">{moment(transaction.date, "YYYYMMDD").locale("nl").format("DD MMMM YYYY")}</p>
			<p className="transaction-description">{transaction.amount}</p>
			<p className="transaction-description">{transaction.debitOrCredit}</p>
			{/*<p className="transaction-description">{transaction.remarks}</p>*/}
			<Select
				className="transaction-category-selection"
				options={categoriesAsOptions}
				value={categoryAsObject()}
				onChange={(event) => setCategory(transaction.id, event.value)}
			/>
		</div>
	)
}

const mapStateToProps = state => ({
	categories: state.categories
})

const mapDispatchToProps = dispatch => ({
	setCategory: (transactionId, categoryId) => dispatch(setCategoryRequest(transactionId, categoryId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Transaction)