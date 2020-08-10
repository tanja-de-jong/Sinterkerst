import React, {useState} from 'react'
import {connect} from 'react-redux'
import Select from 'react-select'
import './Transaction.css'

const Transaction = ({ transaction }) => {

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

	const [selectedCategory, setSelectedCategory] = useState(transaction.category)

	const getSelectedValue = () => {
		return selectedCategory !== null ? categoryAsObject(selectedCategory) : null
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
			<Select
				className="transaction-category-selection"
				options={categories}
				selectedValue={getSelectedValue()}
			/>

		</div>
	)
}

export default Transaction