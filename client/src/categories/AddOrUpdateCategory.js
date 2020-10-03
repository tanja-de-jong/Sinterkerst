import React, {useState} from 'react'
import {addCategoryRequest, updateCategoryRequest} from "./thunks"
import {connect} from "react-redux"
import Select from "react-select"
import CategorySelector from "../transactions/CategorySelector"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
import DeleteIcon from "@material-ui/core/SvgIcon/SvgIcon"

const AddOrUpdateCategory = ({ category, categories, addCategory, updateCategory }) => {

	const [name, setName] = useState(category ? category.name : "")
	const [parent, setParent] = useState(category ? category.parent || null : null)

	const onSubmitPressed = () => {
		category ?
			updateCategory(category.id, name, parent)
			:
			addCategory(name, parent)
	}

	return (
		<div>
			<TextField id="outlined-basic" label="Naam" variant="outlined" onChange={e => setName(e.target.value)} value={name}/>

			<CategorySelector selected={parent} onSelect={setParent} />

			<Button variant="contained" onClick={onSubmitPressed}>Opslaan</Button>
			<DeleteIcon onClick={() => console.log("TODO: delete this category")}/>
		</div>
	)
}

const mapDispatchToProps = dispatch => ({
	addCategory: (name, parent) => dispatch(addCategoryRequest(name, parent)),
	updateCategory: (id, name, parent) => dispatch(updateCategoryRequest(id, name, parent)),
})

export default connect(null, mapDispatchToProps)(AddOrUpdateCategory)