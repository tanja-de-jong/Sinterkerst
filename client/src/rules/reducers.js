import {
	CREATE_RULE,
	LOAD_RULES_FAILURE,
	LOAD_RULES_IN_PROGRESS,
	LOAD_RULES_SUCCESS, UPDATE_RULE
} from "./actions"

export const rules = (state = [], action) => {
	const { type, payload } = action

	switch (type) {
		case CREATE_RULE: {
			const { rule } = payload
			return {
				...state,
				data: state.data.concat(rule)
			}
		}

		case UPDATE_RULE: {
			const {rule: ruleToUpdate} = payload
			return {
				...state,
				data: state.data.map(rule => {
					if (rule.id === ruleToUpdate.id) {
						return ruleToUpdate
					}
					return rule
				})
			}
		}
		
		case LOAD_RULES_SUCCESS: {
			const {rules} = payload
			return {
				data: rules,
				isLoading: false
			}
		}

		case LOAD_RULES_IN_PROGRESS: {
			return {
				...state,
				isLoading: true
			}
		}


		case LOAD_RULES_FAILURE: {
			return {
				...state,
				isLoading: false
			}
		}

		default:
			return state
	}
}