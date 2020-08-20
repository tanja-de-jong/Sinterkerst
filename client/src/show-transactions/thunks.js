import {
	uploadSuccess
} from "./actions"

export const setCategory = (transactionId, categoryId) => async dispatch => {
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
		dispatch(updateCategory(updatedTransaction))
	} catch (e) {
		dispatch(displayAlert(e))
	}
}

export const displayAlert = (text) => () => {
	alert(text)
}