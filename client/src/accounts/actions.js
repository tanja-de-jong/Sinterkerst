export const LOAD_ACCOUNTS_IN_PROGRESS = 'LOAD_ACCOUNTS_IN_PROGRESS'
export const loadAccountsInProgress = () => ({
	type: LOAD_ACCOUNTS_IN_PROGRESS
})

export const LOAD_ACCOUNTS_SUCCESS = 'LOAD_ACCOUNTS_SUCCESS'
export const loadAccountsSuccess = accounts => ({
	type: LOAD_ACCOUNTS_SUCCESS,
	payload: {accounts}
})

export const LOAD_ACCOUNTS_FAILURE = 'LOAD_ACCOUNTS_FAILURE'
export const loadAccountsFailure = () => ({
	type: LOAD_ACCOUNTS_FAILURE
})