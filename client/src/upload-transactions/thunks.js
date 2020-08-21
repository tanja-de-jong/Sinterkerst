import {
	uploadSuccess
} from "./actions"

export const uploadFile = file => async dispatch => {
	try {
		const body = new FormData()
		body.append('transactionList', file)

		const response = await fetch('/upload-file', {
			method: 'post',
			body
		})
		const newTransactions = await response.json()
		debugger
		dispatch(uploadSuccess(newTransactions))
	} catch (e) {
		dispatch(displayAlert(e))
	}
}

export const displayAlert = (text) => () => {
	alert(text)
}