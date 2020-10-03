import React from 'react'
import {connect} from 'react-redux'
import Autocomplete from '@material-ui/lab/Autocomplete';
import styled from 'styled-components'
import {
	allCategories,
	expensesCategories,
	incomeCategories,
	savingsCategories
} from "../categories/selectors"
import TextField from "@material-ui/core/TextField"
import Filter from "./Filter"

const CategorySelector = ({ incomeCategories, expensesCategories, savingsCategories, allCategories, selected, onSelect }) => {
	const createOptions = (group, categories) => {
		return categories.map(category => {
			return { ...category, group: group }
		})
	}

	const categoriesAsOptions = () => {
		const expensesOptions = createOptions("Uitgaven", expensesCategories)
		const incomeOptions = createOptions("Inkomsten", incomeCategories)
		const otherOptions = createOptions("Overige", savingsCategories)

		return expensesOptions.concat(incomeOptions).concat(otherOptions)
	}

	const options = categoriesAsOptions()

	return (
		<Filter label="Categorie" options={options} selected={allCategories.find(cat => cat.id === selected)} handleChange={onSelect} group={true} />
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