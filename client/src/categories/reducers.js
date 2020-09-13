import {
	CREATE_CATEGORY,
	LOAD_CATEGORIES_FAILURE,
	LOAD_CATEGORIES_IN_PROGRESS,
	LOAD_CATEGORIES_SUCCESS,
	UPDATE_CATEGORY
} from "./actions"

const initialState = {
	data: [],
	isLoading: false
}

export const categories = (state = initialState, action) => {
	const { type, payload } = action

	switch (type) {
		case CREATE_CATEGORY: {
			const { category } = payload
			return {
				...state,
				data: state.data.concat(category)
			}
		}

		case UPDATE_CATEGORY: {
			const {category: categoryToUpdate} = payload
			return {
				...state,
				data: state.data.map(category => {
					if (category.id === categoryToUpdate.id) {
						return categoryToUpdate
					}
					return category
				})
			}
		}
		
		case LOAD_CATEGORIES_SUCCESS: {
			const {categories} = payload
			return {
				data: categories,
				isLoading: false
			}
		}

		case LOAD_CATEGORIES_IN_PROGRESS: {
			return {
				...state,
				isLoading: true
			}
		}
		case LOAD_CATEGORIES_FAILURE: {
			return {
				...state,
				isLoading: false
			}
		}

		default:
			return state
	}
}