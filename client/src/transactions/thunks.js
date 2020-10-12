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

		const response = await fetch('/api/transactions/upload', {
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

		const response = await fetch(url)
		const pages = await response.json()
		dispatch(getPages(pages))
	} catch (e) {
		dispatch(displayAlert(e))
	}
}

// Deprecated
export const getRowsRequest = (category) => async (dispatch) => {
	try {
		let url = "/api/transactions/rows"
		if (category) url = url + '?category=' + category

		const response = await fetch(url)
		const rows = await response.json()
		return rows
	} catch (e) {
		dispatch(displayAlert(e))
	}
}

export const getAmountsRequest = (accounts, categories) => async (dispatch) => {
	try {
		const response = await fetch("/api/transactions/amounts?accounts=" + accounts + "&categories=" + categories)
		const amounts = await response.json()
		dispatch(getAmounts(amounts))
	} catch (e) {
	}
}

export const getAmountRequest = (category) => async (dispatch) => {
	try {
		const response = await fetch("/api/transactions/amount?category=" + category)
		const amount = await response.json()
		return amount
	} catch (e) {
	}
}

export const getExpenses = (start, end) => async (dispatch) => {
	try {
		const response = await fetch("/api/expenses?start=" + start + "&end=" + end)
		const expenses = await response.json()
		return expenses
	} catch (e) {
	}
}

export const loadTransactions = (page, category, limit, account, token) => async (dispatch) => {
	try {
		dispatch(loadTransactionsInProgress())
		let url = "/api/transactions?page=" + page
		if (category) url += "&category=" + category
		if (limit) url += "&limit=" + limit
		if (account !== undefined) url += "&account=" + account
		const response = await fetch(url, {
			headers: {
				Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InBpeGZSSEZXdTBFTWVSTEhkbzd4UCJ9.eyJpc3MiOiJodHRwczovL3R3aWxpZ2h0LXNub3dmbGFrZS00MTY1LnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJyU28xZjdXSEc2ekVpZGJabU55cFVQbHZscTE5U3IxVkBjbGllbnRzIiwiYXVkIjoidGFuamEtbW9uZXktbWFuYWdlci5oZXJva3UuY29tIiwiaWF0IjoxNjAxNzMyOTA5LCJleHAiOjE2MDE4MTkzMDksImF6cCI6InJTbzFmN1dIRzZ6RWlkYlptTnlwVVBsdmxxMTlTcjFWIiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.F-PofdQeSBNUUB_n7CnUyW6fby4ca7Orj-gs-R7LZIP5VEfn2IttMCu3YuBJPgkMNCR4T0SPtgkCb_TcNqE8-N6nFDQXskYLZ8iMCjRCw6c8vbNc_7KwsGbw62K4cWxgkWRn7f04Nj8Rnl3QQRUV7aoyiUoHmHfVLNDnkQXLSQjjAsrdC16W4i_sGLlqz_fzUsqEKlWVevkHzc7Z2o4itNg4WE7SqZgKfDllCQQB1M_rhOdUctjxBaUA0rJS2mLjX6NFEOEHykjndSswN3bx53OgutUv82sgkv0GWqRHKZCb0hQy-8ps8Knmt3I8C-_6dZfAxhjFL4gV5dWH7St1iw',
			}
		})
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
		const response = await fetch('/api/transactions/set-category', {
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