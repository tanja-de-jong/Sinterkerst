import React from 'react'

const Category = ({ category, categories }) => {
	const parent = categories.find(parent => parent.id === category.parent)
	let label = category.name
	if (parent) {
		label = label + " (" + parent.name + ")"
	}
	return (
		<div>
			{label}
		</div>
	)
}

export default Category