import {
	loadTransactionsFailure,
	loadTransactionsInProgress,
	loadTransactionsSuccess,
	updateCategory
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

export const setCategory = (transactionId, categoryId) => async dispatch => {
	debugger
	try {
		const body = JSON.stringify({ transactionId, categoryId })
debugger
		const response = await fetch('/set-category', {
			headers: {
				'Content-Type': 'application/json'
			},
			method: 'put',
			body
		})
		const updatedTransaction = await response.json()
		dispatch(updateCategory(updatedTransaction))
	} catch (e) {
		dispatch(displayAlert(e))
	}
}

export const displayAlert = (text) => () => {
	alert(text)
}