import {
	createCategory,
	loadCategoriesFailure,
	loadCategoriesInProgress,
	loadCategoriesSuccess,
	updateCategory
} from "./actions"


export const loadCategories = (token) => async (dispatch) => {
	try {
		dispatch(loadCategoriesInProgress())
		const response = await fetch('/api/categories', {
			headers: {Authorization: 'Bearer ' + token}
		})
		const categories = await response.json()
		dispatch(loadCategoriesSuccess(categories))
	} catch (e) {
		dispatch(loadCategoriesFailure())
		dispatch(displayAlert(e))
	}
}

export const addCategoryRequest = (name, parent, budget, budgetPeriod) => async dispatch => {
	try {
		const body = JSON.stringify({ name, parent, budget, budgetPeriod })
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

export const updateCategoryRequest = (id, name, parent, budget, budgetPeriod) => async dispatch => {
	console.log("Budget")
	console.log(budget)
	console.log("Budget period")
	console.log(budgetPeriod)

	try {
		const body = JSON.stringify({id, name, parent, budget, budgetPeriod})
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