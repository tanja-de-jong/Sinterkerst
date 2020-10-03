import React from 'react'
import CategoryList from "./CategoryList"
import AddOrEditCategory from "./AddOrUpdateCategory"
import {connect} from "react-redux"
import { transactionsLoading } from "../transactions/selectors"
import {
	allCategories,
	categoriesByTopLevel,
	expensesCategories,
	incomeCategories,
	savingsCategories
} from "./selectors"

// CategoryList
	// Edit category
	// Delete category
// Add Category
const CategorySettings = ({ expensesCategories, incomeCategories, savingsCategories, categoriesByTopLevel }) => {

	const renderTopLevelCategory = (topLevel) => {
		return (
			<div>
				<h2>{topLevel.category.name}</h2>
				<CategoryList categories={topLevel.children} topLevel={topLevel.category} />
				<AddOrEditCategory categories={topLevel.children} />
			</div>
		)
	}

	return (
		<div>
			<h1>Category settings</h1>
			{categoriesByTopLevel.map(topLevel => renderTopLevelCategory(topLevel))}
		</div>
	)
}

const mapStateToProps = state => ({
	allCategories: allCategories(state),
	categoriesByTopLevel: categoriesByTopLevel(state),
	incomeCategories: incomeCategories(state),
	expensesCategories: expensesCategories(state),
	savingsCategories: savingsCategories(state),
	isLoading: transactionsLoading(state)
})

export default connect(
	mapStateToProps
)(CategorySettings)