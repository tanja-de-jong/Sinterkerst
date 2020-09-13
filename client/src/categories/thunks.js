import {
	createCategory,
	loadCategoriesFailure,
	loadCategoriesInProgress,
	loadCategoriesSuccess,
	updateCategory
} from "./actions"

export const loadCategories = () => async (dispatch) => {
	try {
		dispatch(loadCategoriesInProgress())
		const response = await fetch('/api/categories')
		const categories = await response.json()
		dispatch(loadCategoriesSuccess(categories))
	} catch (e) {
		dispatch(loadCategoriesFailure())
		dispatch(displayAlert(e))
	}
}

export const addCategoryRequest = (name, parent) => async dispatch => {
	try {
		const body = JSON.stringify({ name, parent })
		const response = await fetch('/api/categories', {
			headers: {
				'Content-Type': 'application/json'
			},
			method: 'post',
			body
		})
		const createdCategory = await response.json()
		dispatch(createCategory(createdCategory))
	} catch (e) {
		dispatch(displayAlert(e))
	}
}

export const updateCategoryRequest = (id, name, parent) => async dispatch => {
	try {
		const body = JSON.stringify({id, name, parent})
		const response = await fetch('/api/categories', {
			headers: {
				'Content-Type': 'application/json'
			},
			method: 'put',
			body
		})
		const updatedCategory = await response.json()
		dispatch(updateCategory(updatedCategory))
	} catch (e) {
		dispatch(displayAlert(e))
	}
}

export const displayAlert = (text) => () => {
	alert(text)
}