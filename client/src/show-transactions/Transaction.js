import React, {useState} from 'react'
import {connect} from 'react-redux'
import Select from 'react-select'
import './Transaction.css'
import moment from 'moment'
import 'moment/locale/nl'
import {uploadFile} from "../upload-transactions/thunks"
import {clearNewTransactions} from "../upload-transactions/actions"
import {setCategory} from "./thunks"

const Transaction = ({ transaction, setCategory }) => {

	const categories = [
		{
			"value": 0,
			"label": "Category A"
		}, {
			"value": 1,
			"label": "Category B"
		}, {
			"value": 2,
			"label": "Category C"
		}
	]

	const [selectedCategory] = useState(transaction.category || -1)

	const getSelectedValue = () => {
		return selectedCategory !== -1 ? categoryAsObject(selectedCategory) : null
	}

	const categoryAsObject = (categoryId) => {
		return (
			{
				"value": categoryId,
				"label": categories.find(category => category.value === categoryId).label
			}
		)
	}
	debugger

	return (
		<div className="transaction">
			<p className="transaction-description">{transaction.description}</p>
			<p className="transaction-description">{moment(transaction.date, "YYYYMMDD").locale("nl").format("DD MMMM YYYY")}</p>
			<p className="transaction-description">{transaction.amount}</p>
			<p className="transaction-description">{transaction.debitOrCredit}</p>
			{/*<p className="transaction-description">{transaction.remarks}</p>*/}
			<Select
				className="transaction-category-selection"
				options={categories}
				selectedValue={getSelectedValue()}
				onChange={(event) => setCategory(transaction.id, event.value)}
			/>
		</div>
	)
}

const mapDispatchToProps = dispatch => ({
	setCategory: (transactionId, categoryId) => dispatch(setCategory(transactionId, categoryId)),
})

export default connect(mapDispatchToProps)(Transaction)