import React from 'react'
import Category from "./Category"

const CategoryList = ({ categories }) => {
	return (
		<div>
			{categories.map(category => <Category key={category.id} category={category} categories={categories} />)}
		</div>
	)
}

export default CategoryList