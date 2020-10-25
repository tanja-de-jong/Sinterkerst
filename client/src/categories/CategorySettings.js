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
import Card from "@material-ui/core/Card"
import {makeStyles} from "@material-ui/core/styles"

const useStyles = makeStyles((theme) => ({
	card: {
		borderRadius: '25px',
		width: '500px',
		padding: '10px',
		margin: '10px'
	},
	page: {
		display: 'flex'
	}
}))

const CategorySettings = ({ expensesCategories, incomeCategories, savingsCategories, categoriesByTopLevel }) => {
	const classes = useStyles();

	const renderTopLevelCategory = (topLevel) => {
		return (
			<Card className={classes.card}>
				<h2>{topLevel.category.name}</h2>
				<CategoryList categories={topLevel.children} topLevel={topLevel.category} />
				<AddOrEditCategory categories={topLevel.children} />
			</Card>
		)
	}

	return (
		<div>
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