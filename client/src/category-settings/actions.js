export const UPDATE_CATEGORY = 'UPDATE_CATEGORY'
export const updateCategory = (updatedTransaction) => ({
	type: UPDATE_CATEGORY,
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