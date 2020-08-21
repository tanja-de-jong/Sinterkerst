import {
	LOAD_TRANSACTIONS_FAILURE,
	LOAD_TRANSACTIONS_IN_PROGRESS,
	LOAD_TRANSACTIONS_SUCCESS,
	SET_CATEGORY
} from "./actions"
import {PROCESS_NEW_TRANSACTIONS} from "../upload-transactions/actions"

export const isLoading = (state = false, action) => {
	const { type } = action

	switch (type) {
		case LOAD_TRANSACTIONS_IN_PROGRESS:
			return true
		case LOAD_TRANSACTIONS_SUCCESS:
		case LOAD_TRANSACTIONS_FAILURE:
			return false
		default:
			return state
	}
}

export const transactions = (state = [], action) => {
	const { type, payload } = action

	switch (type) {
		case SET_CATEGORY: {
			return state.map(transaction => transaction.id === payload.id ? payload : transaction)
		}

		case LOAD_TRANSACTIONS_SUCCESS: {
			const {inventory} = payload
			return inventory
		}

		case LOAD_TRANSACTIONS_IN_PROGRESS:
		case LOAD_TRANSACTIONS_FAILURE:
		default:
			return state
	}
}