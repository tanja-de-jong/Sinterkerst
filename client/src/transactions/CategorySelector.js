import React from 'react'
import {connect} from 'react-redux'
import Select from "react-select"
import styled from 'styled-components'
import {
	allCategories,
	expensesCategories,
	incomeCategories,
	savingsCategories
} from "../categories/selectors"

const CategorySelector = ({ selected, debitOrCredit, incomeCategories, expensesCategories, savingsCategories, allCategories, onSelect }) => {
	const categoriesAsOptions = () => {
		const createLabel = (categories, category) => {
			const parent = categories.find(parent => parent.id === category.parent)
			return category.name + (parent ?  " (" + parent.name + ")" : "")
		}

		const createOptions = (categories) => {
			return categories.map(category => {
				return {
					"value": category.id,
					"label": createLabel(categories, category)
				}
			})
		}

		const expensesOptions = {
			"label": "Uitgaven",
			"options": createOptions(expensesCategories)
		}

		const incomeOptions = {
			"label": "Inkomsten",
			"options": createOptions(incomeCategories)
		}

		const savingsOptions = {
			"label": "Sparen",
			"options": createOptions(savingsCategories)
		}

		return debitOrCredit === "Bij" ? [ incomeOptions, expensesOptions, savingsOptions ] : [ expensesOptions, incomeOptions, savingsOptions ]
	}

	const categoryAsObject = () => {
		debugger
		return (
			selected
				? {
					"value": selected,
					"label": allCategories.find(category => category.id === selected).name
				}
				: null
		)
	}

	const SelectDiv = styled.div`
		width: 200px;
	`

	return (
		<SelectDiv>
			<Select
				className="category-selection"
				options={categoriesAsOptions()}
				value={categoryAsObject()}
				onChange={(event) => onSelect(event.value, event.label)}
			/>
		</SelectDiv>
	)
}

const mapStateToProps = state => ({
	allCategories: allCategories(state),
	incomeCategories: incomeCategories(state),
	expensesCategories: expensesCategories(state),
	savingsCategories: savingsCategories(state)
})

export default connect(
	mapStateToProps
)(CategorySelector)