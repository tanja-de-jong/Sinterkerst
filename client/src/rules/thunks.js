import {
	createRule,
	loadRulesFailure,
	loadRulesInProgress,
	loadRulesSuccess, updateRule
} from "./actions"

export const loadRules = () => async (dispatch) => {
	try {
		dispatch(loadRulesInProgress())
		const response = await fetch('/api/rules')
		const rules = await response.json()
		dispatch(loadRulesSuccess(rules))
	} catch (e) {
		dispatch(loadRulesFailure())
		dispatch(displayAlert(e))
	}
}

export const addRuleRequest = (description, category, field, text) => async dispatch => {
	try {
		const body = JSON.stringify({
			description,
			comparisons: [
				{
					field,
					"type": "includes",
					text
				}
			],
			category
		})
		const response = await fetch('/api/rules', {
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

export const updateRuleRequest = (id, description, parent, type) => async dispatch => {
	try {
		const body = JSON.stringify({id, description, parent, type})
		const response = await fetch('/api/rules', {
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