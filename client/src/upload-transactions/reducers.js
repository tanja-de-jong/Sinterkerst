import {
	CLEAR_NEW_TRANSACTIONS,
	UPLOAD_SUCCESS
} from "./actions"
import {SET_CATEGORY} from "../show-transactions/actions"

export const uploadTransactions = (state = [], action) => {
	const { type, payload } = action

	switch (type) {
		case UPLOAD_SUCCESS: {
			return payload
		}

		case SET_CATEGORY: {
			return state.map(transaction => transaction.id === payload.id ? payload : transaction)
		}

		case CLEAR_NEW_TRANSACTIONS: {
			return []
		}

		default:
			return state
	}
}