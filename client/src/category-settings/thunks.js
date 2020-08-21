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
		const response = await fetch('/categories')
		const categories = await response.json()
		debugger
		dispatch(loadCategoriesSuccess(categories))
	} catch (e) {
		dispatch(loadCategoriesFailure())
		dispatch(displayAlert(e))
	}
}

export const addCategoryRequest = (name, parent, expenses) => async dispatch => {
	try {
		const body = JSON.stringify({ name, parent, expenses })
		const response = await fetch('/categories', {
			headers: {
				'Content-Type': 'application/json'
			},
			method: 'post',
			body
		})
		debugger
		const createdCategory = await response.json()
		debugger
		dispatch(createCategory(createdCategory))
	} catch (e) {
		dispatch(displayAlert(e))
	}
}

export const updateCategoryRequest = (id, name, parent, expenses) => async dispatch => {
	debugger
	try {
		const body = JSON.stringify({id, name, parent, expenses})
		const response = await fetch('/categories', {
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