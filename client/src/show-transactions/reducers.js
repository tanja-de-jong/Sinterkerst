import { UPDATE_CATEGORY } from "./actions"

export const transactions = (state = [], action) => {
	const { type, payload } = action

	switch (type) {
		// TODO: fetch transactions - somewhere else? Like in Dashboard?

		case UPDATE_CATEGORY: {
			// TODO
			return payload
		}

		default:
			return state
	}
}