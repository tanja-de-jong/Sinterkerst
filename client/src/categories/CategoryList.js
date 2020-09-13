import React from 'react'
import Category from "./Category"

const CategoryList = ({ categories, topLevel }) => {
	const topCategories = categories.filter(category => category.parent === topLevel.id)

	const renderCategoryWithChildren = (parent, level) => {
		const children = categories.filter(category => category.parent === parent.id)
		const childDivs = children.map(child => renderCategoryWithChildren(child, level + "---"))

		return <p>
			{<Category key={parent.id} category={parent} categories={categories} level={level} />}
			{childDivs}
		</p>
	}

	return (
		<div>
			{topCategories.map(topCategory => renderCategoryWithChildren(topCategory, ""))}
		</div>
	)
}

export default CategoryList