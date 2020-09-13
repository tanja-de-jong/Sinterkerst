import {
	CLEAR_NEW_TRANSACTIONS, GET_AMOUNTS, GET_PAGES,
	LOAD_TRANSACTIONS_FAILURE,
	LOAD_TRANSACTIONS_IN_PROGRESS,
	LOAD_TRANSACTIONS_SUCCESS,
	SET_CATEGORY, UPLOAD_SUCCESS
} from "./actions"

export const transactions = (state = [], action) => {
	const { type, payload } = action

	switch (type) {
		case GET_PAGES: {
			return {
				...state,
				pages: payload
			}
		}

		case GET_AMOUNTS: {
			return {
				...state,
				amounts: payload
			}
		}

		case SET_CATEGORY: {
			return {
				...state,
				data: state.data.map(transaction => transaction.id === payload.id ? payload : transaction),
				new: state.new.map(transaction => transaction.id === payload.id ? payload : transaction)
			}
		}

		case LOAD_TRANSACTIONS_SUCCESS: {
			const {inventory} = payload
			return {
				...state,
				data: inventory,
				isLoading: false
			}
		}

		case LOAD_TRANSACTIONS_IN_PROGRESS: {
			return {
				...state,
				isLoading: true
			}
		}

		case LOAD_TRANSACTIONS_FAILURE: {
			return {
				...state,
				isLoading: false
			}
		}

		case UPLOAD_SUCCESS: {
			return {
				...state,
				data: state.data.map(transaction => transaction.id === payload.id ? payload : transaction),
				new: payload.newTransactions,
				existing: payload.existingTransactions
			}
		}

		case CLEAR_NEW_TRANSACTIONS: {
			return {
				...state,
				new: [],
				existing: []
			}
		}

		default:
			return state
	}
}