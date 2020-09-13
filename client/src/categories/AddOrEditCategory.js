import React, {useState} from 'react'
import {addCategoryRequest, updateCategoryRequest} from "./thunks"
import {connect} from "react-redux"
import Select from "react-select"
import CategorySelector from "../transactions/CategorySelector"

const AddOrUpdateCategory = ({ category, categories, addCategory, updateCategory }) => {

	const [name, setName] = useState(category ? category.name : "")
	const [parent, setParent] = useState(category ? category.parent || null : null)

	const onSubmitPressed = () => {
		category ?
			updateCategory(category.id, name, parent)
			:
			addCategory(name, parent)
	}

	const categoriesAsOptions = categories.map(category => {
		const parent = categories.find(parent => parent.id === category.parent)
		let label = category.name
		if (parent) {
			label = label + " (" + parent.name + ")"
		}
		return {
			"value": category.id,
			"label": label
		}
	})

	const parentAsObject = () => {
		return parent !== null
		? {
			"value": parent,
			"label": categories.find(category => category.id === parent).name
		}
		: null
	}

	return (
		<form onSubmit={onSubmitPressed}>
			<label>
				Naam:
				<input type="text" name="name" value={name} onChange={e => setName(e.target.value)} />
			</label>

			<CategorySelector selected={parent} onSelect={setParent} />

			{/*<Select*/}
			{/*	className="category-parent-selection"*/}
			{/*	options={categoriesAsOptions}*/}
			{/*	value={parentAsObject()}*/}
			{/*	onChange={(event) => setParent(event.value)}*/}
			{/*/>*/}

			<input type="submit" value="Submit" />
		</form>
	)
}

const mapDispatchToProps = dispatch => ({
	addCategory: (name, parent) => dispatch(addCategoryRequest(name, parent)),
	updateCategory: (id, name, parent) => dispatch(updateCategoryRequest(id, name, parent)),
})

export default connect(null, mapDispatchToProps)(AddOrUpdateCategory)