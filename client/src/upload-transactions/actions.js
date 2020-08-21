export const UPLOAD_SUCCESS = 'UPLOAD_SUCCESS'
export const uploadSuccess = (transactions) => ({
	type: UPLOAD_SUCCESS,
	payload: transactions
})

export const CLEAR_NEW_TRANSACTIONS = 'CLEAR_NEW_TRANSACTIONS'
export const clearNewTransactions = () => ({
	type: CLEAR_NEW_TRANSACTIONS,
})