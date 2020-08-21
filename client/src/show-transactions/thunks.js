import {
	loadTransactionsFailure,
	loadTransactionsInProgress,
	loadTransactionsSuccess,
	setCategory
} from "./actions"

export const loadTransactions = () => async (dispatch) => {
	try {
		dispatch(loadTransactionsInProgress())
		const response = await fetch('/transactions')
		const transactions = await response.json()
		debugger
		dispatch(loadTransactionsSuccess(transactions))
	} catch (e) {
		dispatch(loadTransactionsFailure())
		dispatch(displayAlert(e))
	}
}

export const setCategoryRequest = (transactionId, categoryId) => async dispatch => {
	try {
		const body = JSON.stringify({ transactionId, categoryId })
		const response = await fetch('/set-category', {
			headers: {
				'Content-Type': 'application/json'
			},
			method: 'put',
			body
		})
		const updatedTransaction = await response.json()
		dispatch(setCategory(updatedTransaction))
	} catch (e) {
		dispatch(displayAlert(e))
	}
}

export const displayAlert = (text) => () => {
	alert(text)
}