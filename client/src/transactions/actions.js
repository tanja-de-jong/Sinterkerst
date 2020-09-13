export const SET_CATEGORY = 'SET_CATEGORY'
export const setCategory = (updatedTransaction) => ({
	type: SET_CATEGORY,
	payload: updatedTransaction
})

export const GET_PAGES = 'GET_PAGES'
export const getPages = (pages) => ({
	type: GET_PAGES,
	payload: pages
})

export const GET_AMOUNTS = 'GET_AMOUNTS'
export const getAmounts = (amounts) => ({
	type: GET_AMOUNTS,
	payload: amounts
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

export const UPLOAD_SUCCESS = 'UPLOAD_SUCCESS'
export const uploadSuccess = (transactions) => ({
	type: UPLOAD_SUCCESS,
	payload: transactions
})

export const CLEAR_NEW_TRANSACTIONS = 'CLEAR_NEW_TRANSACTIONS'
export const clearNewTransactions = () => ({
	type: CLEAR_NEW_TRANSACTIONS,
})