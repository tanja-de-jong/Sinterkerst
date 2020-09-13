import React, {useState} from 'react'
import {addRuleRequest, updateRuleRequest} from "./thunks"
import {connect} from "react-redux"
import Select from "react-select"
import {allCategories} from "../categories/selectors"
import CategorySelector from "../transactions/CategorySelector"
const AddOrUpdateRule = ({ rule, categories, addRule, updateRule }) => {

	const [description, setDescription] = useState(rule ? rule.name : "")
	const [category, setCategory] = useState(rule && rule.category ? rule.category : null)
	const [field, setField] = useState(rule && rule.comparisons.length > 0 && rule.comparisons[0].field ? { "value": rule.comparisons[0].field, "label": rule.comparisons[0].field } : null)
	const [comparator, setComparator] = useState(rule && rule.comparisons.length > 0 && rule.comparisons[0].type ? { "value": rule.comparisons[0].type, "label": rule.comparisons[0].tyle } : null)
	const [text, setText] = useState(rule && rule.comparisons.length > 0 ? rule.comparisons[0].text : "")

	const onSubmitPressed = () => {
		rule ?
			updateRule(rule.id, description, category, field.value, text)
			:
			addRule(description, category, field.value, text)
	}

	const categoriesAsOptions = categories.map(rule => {
		const parent = categories.find(parent => parent.id === rule.parent)
		let label = rule.name
		if (parent) {
			label = label + " (" + parent.name + ")"
		}
		return {
			"value": rule.id,
			"label": label
		}
	})

	const categoryAsObject = () => {
		return category !== null
		? {
			"value": category,
			"label": categories.find(rule => rule.id === category).name
		}
		: null
	}

	const fieldOptions = [
		{
			"value": "remarks",
			"label": "remarks"
		}, {
			"value": "otherAccount",
			"label": "otherAccount"
		}, {
			"value": "description",
			"label": "description"
		}
	]

	const comparatorOptions = [
		{
			"value": "includes",
			"label": "includes"
		}
	]

	return (
		<form onSubmit={onSubmitPressed}>
			<h2>Maak nieuwe regel</h2>
			<div>
				<input type="text" name="description" value={description} placeholder="Omschrijving" onChange={e => setDescription(e.target.value)} />
			</div>

			<div>
				<Select
					className="field-selection"
					options={fieldOptions}
					value={field}
					placeholder={"Veld"}
					onChange={(event) => setField({ "value": event.value, "label": event.label })}
				/>
				<Select
					className="comparator-selection"
					options={comparatorOptions}
					value={comparator}
					placeholder={"Comparator"}
					onChange={(event) => setComparator({ "value": event.value, "label": event.label })}
				/>
				<input type="text" name="text" value={text} placeholder="Tekst" onChange={e => setText(e.target.value)} />
			</div>

			<div>
				<CategorySelector selected={category} placeholder="Category" onSelect={setCategory} />
			</div>

			<input type="submit" value="Submit" />
		</form>
	)
}

const mapStateToProps = state => ({
	categories: allCategories(state)
})

const mapDispatchToProps = dispatch => ({
	addRule: (description, category, field, text) => dispatch(addRuleRequest(description, category, field, text)),
	updateRule: (id, description, category, field, text) => dispatch(updateRuleRequest(id, description, category, field, text)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AddOrUpdateRule)