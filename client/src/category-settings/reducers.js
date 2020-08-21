import {
	CREATE_CATEGORY,
	LOAD_CATEGORIES_FAILURE,
	LOAD_CATEGORIES_IN_PROGRESS,
	LOAD_CATEGORIES_SUCCESS, UPDATE_CATEGORY
} from "./actions"

export const isLoading = (state = false, action) => {
	const { type } = action

	switch (type) {
		case LOAD_CATEGORIES_IN_PROGRESS:
			return true
		case LOAD_CATEGORIES_SUCCESS:
		case LOAD_CATEGORIES_FAILURE:
			return false
		default:
			return state
	}
}

export const categories = (state = [], action) => {
	const { type, payload } = action

	switch (type) {
		case CREATE_CATEGORY: {
			const { category } = payload
			return state.concat(category)
		}

		case UPDATE_CATEGORY: {
			debugger
			const {category: categoryToUpdate} = payload
			return state.map(category => {
				if (category.id === categoryToUpdate.id) {
					return categoryToUpdate
				}
				return category
			})
		}
		
		case LOAD_CATEGORIES_SUCCESS: {
			const {categories} = payload
			return categories
		}

		case LOAD_CATEGORIES_IN_PROGRESS:
		case LOAD_CATEGORIES_FAILURE:
		default:
			return state
	}
}