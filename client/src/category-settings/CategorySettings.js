import React, {useEffect} from 'react'
import CategoryList from "./CategoryList"
import AddOrEditCategory from "./AddOrEditCategory"
import {loadCategories} from "./thunks"
import {connect} from "react-redux"

// CategoryList
	// Edit category
	// Delete category
// Add Category
const CategorySettings = ({ categories, isLoading, startLoadingCategories }) => {
	useEffect(() => {
		startLoadingCategories()
	}, [])

	return (
		<div>
			<h1>Category settings</h1>
			<h2>Uitgaven</h2>
			<CategoryList categories={categories.expenses} />
			<AddOrEditCategory categories={categories.expenses} expenses={true} />

			<h2>Inkomsten</h2>
			<CategoryList categories={categories.income} />
			<AddOrEditCategory categories={categories.income} expenses={false} />
		</div>
	)
}

const mapStateToProps = state => ({
	categories: state.categories,
	isLoading: state.isLoading
})

const mapDispatchToProps = dispatch => ({
	startLoadingCategories: () => dispatch(loadCategories())
})
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CategorySettings)