import {
	createRule,
	loadRulesFailure,
	loadRulesInProgress,
	loadRulesSuccess, updateRule
} from "./actions"
import {apiFetch} from "../helper"

export const loadRules = () => async (dispatch) => {
	try {
		dispatch(loadRulesInProgress())
		const response = await apiFetch('/api/rules')
		const rules = await response.json()
		dispatch(loadRulesSuccess(rules))
	} catch (e) {
		dispatch(loadRulesFailure())
		dispatch(displayAlert(e))
	}
}

export const addRuleRequest = (name, category, field, text) => async dispatch => {
	try {
		const body = JSON.stringify({
			name,
			comparisons: [
				{
					field,
					"type": "includes",
					text
				}
			],
			category
		})
		const response = await apiFetch('/api/rules', {
			headers: {
				'Content-Type': 'application/json'
			},
			method: 'post',
			body
		})
		const createdRule = await response.json()
		dispatch(createRule(createdRule))
	} catch (e) {
		dispatch(displayAlert(e))
	}
}

export const updateRuleRequest = (id, name, parent, type) => async dispatch => {
	try {
		const body = JSON.stringify({id, name, parent, type})
		const response = await apiFetch('/api/rules', {
			headers: {
				'Content-Type': 'application/json'
			},
			method: 'put',
			body
		})
		const updatedRule = await response.json()
		dispatch(updateRule(updatedRule))
	} catch (e) {
		dispatch(displayAlert(e))
	}
}

export const displayAlert = (text) => () => {
	alert(text)
}