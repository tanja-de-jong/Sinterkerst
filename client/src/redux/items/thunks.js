import {
	createItemFailure,
	createItemSuccess, fetchItemsBegin, fetchItemsFailure, fetchItemsSuccess,
	toggleCheckFailure,
	toggleCheckSuccess
} from "./action"

export const fetchItems = () => async (dispatch) => {
	dispatch(fetchItemsBegin())
	const response = await fetch(`api/items`)
	const items = await response.json()
	dispatch(fetchItemsSuccess(items))
}

export const createItem = (item) => async (dispatch) => {
	const body = JSON.stringify(item)
	const response = await fetch(`api/items`, {
		method: 'POST',
		body,
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
	})
	const result = await response.json()
	dispatch(createItemSuccess(result.item, result.log));
}

export const toggleCheck = (item, buyerId) => async (dispatch) => {
	const body = JSON.stringify({item, buyerId})
	const response = await fetch('/api/check', {
		method: 'POST',
		body,
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
	})
	const result = await response.json()
	dispatch(toggleCheckSuccess(result.item, result.log));
}