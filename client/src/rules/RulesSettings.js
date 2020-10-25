import React from 'react'
import RuleList from "./RuleList"
import AddOrEditRule from "./AddOrEditRule"
import Card from "@material-ui/core/Card"

// CategoryList
	// Edit category
	// Delete category
// Add Category
const RulesSettings = () => {
	return (
		<Card>
			<h1>Regels instellen</h1>
			<RuleList />
			<AddOrEditRule />
		</Card>
	)
}

export default RulesSettings