import React, {useState} from 'react'
import {addCategoryRequest, updateCategoryRequest} from "./thunks"
import {connect} from "react-redux"
import CategorySelector from "../transactions/CategorySelector"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
import DeleteIcon from "@material-ui/core/SvgIcon/SvgIcon"
import Input from "@material-ui/core/Input"
import InputAdornment from "@material-ui/core/InputAdornment"
import InputLabel from "@material-ui/core/InputLabel"
import Autocomplete from "@material-ui/lab/Autocomplete"

const AddOrUpdateCategory = ({ category, categories, addCategory, updateCategory, close }) => {

	const [name, setName] = useState(category ? category.name : "")
	const [parent, setParent] = useState(category ? category.parent || null : null)
	const [budget, setBudget] = useState(category ? category.budget || 0 : 0)
	const [budgetPeriod, setBudgetPeriod] = useState(category ? category.budgetperiod || null : null)

	const onSubmitPressed = () => {
		category ?
			updateCategory(category.id, name, parent, budget, budgetPeriod)
			:
			addCategory(name, parent, budget, budgetPeriod)
		if (close) close()
	}

	return (
		<div>
			<TextField id="outlined-basic" label="Naam" variant="outlined" onChange={e => setName(e.target.value)} value={name}/>

			<CategorySelector selected={parent} onSelect={setParent} />

			<InputLabel htmlFor="standard-adornment-amount">Amount</InputLabel>
			<Input
				id="standard-adornment-amount"
				value={budget}
				onChange={e => setBudget(e.target.value)}
				startAdornment={<InputAdornment position="start">€</InputAdornment>}
			/>

			<Autocomplete
				value={budgetPeriod}
				options={["Maand", "Jaar"]}
				renderInput={(params) => <TextField {...params} label="Periode" variant="outlined"/>}
				onChange={(event, newValue) => {
					const upperCaseValue = newValue
					upperCaseValue.toUpperCase()
					setBudgetPeriod(upperCaseValue)
				}}
				style={{ width: 300 }}
			/>

			<Button variant="contained" onClick={onSubmitPressed}>Opslaan</Button>
			<DeleteIcon onClick={() => console.log("TODO: delete this category")}/>
		</div>
	)
}

const mapDispatchToProps = dispatch => ({
	addCategory: (name, parent, budget, budgetPeriod) => dispatch(addCategoryRequest(name, parent, budget, budgetPeriod)),
	updateCategory: (id, name, parent, budget, budgetPeriod) => dispatch(updateCategoryRequest(id, name, parent, budget, budgetPeriod)),
})

export default connect(null, mapDispatchToProps)(AddOrUpdateCategory)