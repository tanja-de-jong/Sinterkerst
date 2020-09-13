import {
	getAmounts,
	getPages,
	loadTransactionsFailure,
	loadTransactionsInProgress,
	loadTransactionsSuccess,
	setCategory, uploadSuccess
} from "./actions"

export const uploadFile = file => async dispatch => {
	try {
		const body = new FormData()
		body.append('transactionList', file)

		const response = await fetch('/api/upload-file', {
			method: 'post',
			body
		})
		const newTransactions = await response.json()
		dispatch(uploadSuccess(newTransactions))
	} catch (e) {
		dispatch(displayAlert(e))
	}
}

export const getPagesRequest = (category) => async (dispatch) => {
	try {
		let url = "/api/pages"
		if (category) url = url + '?category=' + category
		debugger
		const response = await fetch(url)
		const pages = await response.json()
		dispatch(getPages(pages))
	} catch (e) {
		dispatch(displayAlert(e))
	}
}

export const getAmountsRequest = (categories) => async (dispatch) => {
	try {
		const response = await fetch("/api/transactions/amount?categories=" + categories)
		const amounts = await response.json()
		dispatch(getAmounts(amounts))
	} catch (e) {
		dispatch(displayAlert(e))
	}
}

export const loadTransactions = (page, category) => async (dispatch) => {
	debugger
	try {
		dispatch(loadTransactionsInProgress())
		let url = "/api/transactions?page=" + page
		if (category) url += "&category=" + category
		debugger
		const response = await fetch(url)
		const transactions = await response.json()
		dispatch(loadTransactionsSuccess(transactions))
	} catch (e) {
		dispatch(loadTransactionsFailure())
		dispatch(displayAlert(e))
	}
}

export const loadTransactionsNoPagination = (category) => async (dispatch) => {
	try {
		dispatch(loadTransactionsInProgress())
		let url = "/api/transactions"
		if (category) url += "?category=" + category
		debugger
		const response = await fetch(url)
		const transactions = await response.json()
		dispatch(loadTransactionsSuccess(transactions))
	} catch (e) {
		dispatch(loadTransactionsFailure())
		dispatch(displayAlert(e))
	}
}

export const setCategoryRequest = (transactionId, categoryId) => async dispatch => {
	try {
		const body = JSON.stringify({ transactionId, categoryId })
		const response = await fetch('/api/set-category', {
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

export const applyRules = () => async (dispatch) => {
	debugger
	try {
		const body = JSON.stringify({ "uncategorizedOnly": true })
		const response = await fetch('/api/apply_rules', {
			headers: {
				'Content-Type': 'application/json'
			},
			method: 'put',
			body
		})
		const { updatedTransactions, failedTransactions } = await response.json()
		updatedTransactions.forEach(transaction => dispatch(setCategory(transaction)))
		failedTransactions.forEach(transaction => console.log("Apply rules failed: " + transaction))
	} catch (e) {
		dispatch(displayAlert(e))
	}
}

export const displayAlert = (text) => () => {
	alert(text)
}