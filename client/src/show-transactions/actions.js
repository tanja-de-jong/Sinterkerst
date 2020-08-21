export const SET_CATEGORY = 'SET_CATEGORY'
export const setCategory = (updatedTransaction) => ({
	type: SET_CATEGORY,
	payload: updatedTransaction
})

export const LOAD_TRANSACTIONS_IN_PROGRESS = 'LOAD_TRANSACTIONS_IN_PROGRESS'
export const loadTransactionsInProgress = () => ({
	type: LOAD_TRANSACTIONS_IN_PROGRESS
})

export const LOAD_TRANSACTIONS_SUCCESS = 'LOAD_TRANSACTIONS_SUCCESS'
export const loadTransactionsSuccess = inventory => ({
	type: LOAD_TRANSACTIONS_SUCCESS,
	payload: {inventory}
})

export const LOAD_TRANSACTIONS_FAILURE = 'LOAD_TRANSACTIONS_FAILURE'
export const loadTransactionsFailure = () => ({
	type: LOAD_TRANSACTIONS_FAILURE
})