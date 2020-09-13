export const LOAD_RULES_IN_PROGRESS = 'LOAD_RULES_IN_PROGRESS'
export const loadRulesInProgress = () => ({
	type: LOAD_RULES_IN_PROGRESS
})

export const LOAD_RULES_SUCCESS = 'LOAD_RULES_SUCCESS'
export const loadRulesSuccess = rules => ({
	type: LOAD_RULES_SUCCESS,
	payload: {rules}
})

export const LOAD_RULES_FAILURE = 'LOAD_RULES_FAILURE'
export const loadRulesFailure = () => ({
	type: LOAD_RULES_FAILURE
})

export const CREATE_RULE = 'CREATE_RULE'
export const createRule = rule => ({
	type: CREATE_RULE,
	payload: {rule}
})

export const UPDATE_RULE = 'UPDATE_RULE'
export const updateRule = rule => ({
	type: UPDATE_RULE,
	payload: {rule}
})