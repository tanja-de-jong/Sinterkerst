import {
	CREATE_ITEM,
	REMOVE_ITEM,
	LOAD_ITEMS_IN_PROGRESS,
	LOAD_ITEMS_SUCCESS,
	LOAD_ITEMS_FAILURE, UPDATE_ITEM
} from "./actions"

export const isLoading = (state = false, action) => {
	const { type } = action

	switch (type) {
		case LOAD_ITEMS_IN_PROGRESS:
			return true
		case LOAD_ITEMS_SUCCESS:
		case LOAD_ITEMS_FAILURE:
			return false
		default:
			return state
	}
}

export const inventory = (state = [], action) => {
	const { type, payload } = action

	switch (type) {
		case CREATE_ITEM: {
			const { item } = payload
			return state.concat(item)
		}

		case UPDATE_ITEM: {
			debugger
			const {item: itemToUpdate} = payload
			return state.map(item => {
				if (item.id === itemToUpdate.id) {
					return itemToUpdate
				}
				return item
			})
		}

		case REMOVE_ITEM: {
			debugger
			const { item: itemToRemove } = payload
			return state.filter(item => item.id !== itemToRemove.id)
		}

		case LOAD_ITEMS_SUCCESS: {
			const { inventory } = payload
			return inventory
		}

		case LOAD_ITEMS_IN_PROGRESS:
		case LOAD_ITEMS_FAILURE:
		default:
			return state
	}
}