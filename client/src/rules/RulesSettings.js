import React from 'react'
import RuleList from "./RuleList"
import AddOrEditRule from "./AddOrEditRule"

// CategoryList
	// Edit category
	// Delete category
// Add Category
const RulesSettings = () => {
	return (
		<div>
			<h1>Regels instellen</h1>
			<RuleList />
			<AddOrEditRule />
		</div>
	)
}

export default RulesSettings