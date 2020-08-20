import {
	createItem,
	loadItemsFailure,
	loadItemsInProgress,
	loadItemsSuccess,
	removeItem, updateItem
} from "./actions"

export const loadItems = () => async (dispatch) => {
	try {
		dispatch(loadItemsInProgress())
		const response = await fetch('/inventory')
		const inventory = await response.json()

		dispatch(loadItemsSuccess(inventory))
	} catch (e) {
		dispatch(loadItemsFailure())
		dispatch(displayAlert(e))
	}
}

export const addItemRequest = (title, magnitude, unit, date) => async dispatch => {
	try {
		const body = JSON.stringify({ title, magnitude, unit, date })
		const response = await fetch('/inventory', {
			headers: {
				'Content-Type': 'application/json'
			},
			method: 'post',
			body
		})
		const createdItem = await response.json()
		dispatch(createItem(createdItem))
	} catch (e) {
		dispatch(displayAlert(e))
	}
}

export const updateItemRequest = (id, title, magnitude, unit, date) => async dispatch => {
	debugger
	try {
		const body = JSON.stringify({ id, title, magnitude, unit, date })
		const response = await fetch('/inventory', {
			headers: {
				'Content-Type': 'application/json'
			},
			method: 'put',
			body
		})
		const updatedItem = await response.json()
		dispatch(updateItem(updatedItem))
		console.log("END")
	} catch (e) {
		dispatch(displayAlert(e))
	}
}

export const removeItemRequest = id => async dispatch => {
	try {
		const response = await fetch(`/inventory/${id}`,
			{
				method: 'delete'
			})
		const removedItem = await response.json()
		dispatch(removeItem(removedItem))
	} catch (e) {
		dispatch(displayAlert(e))
	}
}

export const displayAlert = (text) => () => {
	alert(text)
}