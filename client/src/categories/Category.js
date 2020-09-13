import React from 'react'

const Category = ({ category, level, categories }) => {
	const parent = categories.find(parent => parent.id === category.parent)
	let label = level + " " + category.name
	if (parent) {
		label = label + " (" + parent.name + ")" + " " + category.id
	}
	return (
		<div>
			{label}
		</div>
	)
}

export default Category