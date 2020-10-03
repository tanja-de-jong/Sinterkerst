import {
	LOAD_ACCOUNTS_FAILURE,
	LOAD_ACCOUNTS_IN_PROGRESS,
	LOAD_ACCOUNTS_SUCCESS,
} from "./actions"

const initialState = {
	data: [],
	isLoading: false
}

export const accounts = (state = initialState, action) => {
	const { type, payload } = action

	switch (type) {
		case LOAD_ACCOUNTS_SUCCESS: {
			const {accounts} = payload
			return {
				data: accounts,
				isLoading: false
			}
		}

		case LOAD_ACCOUNTS_IN_PROGRESS: {
			return {
				...state,
				isLoading: true
			}
		}
		case LOAD_ACCOUNTS_FAILURE: {
			return {
				...state,
				isLoading: false
			}
		}

		default:
			return state
	}
}