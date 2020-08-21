export const LOAD_CATEGORIES_IN_PROGRESS = 'LOAD_CATEGORIES_IN_PROGRESS'
export const loadCategoriesInProgress = () => ({
	type: LOAD_CATEGORIES_IN_PROGRESS
})

export const LOAD_CATEGORIES_SUCCESS = 'LOAD_CATEGORIES_SUCCESS'
export const loadCategoriesSuccess = categories => ({
	type: LOAD_CATEGORIES_SUCCESS,
	payload: {categories}
})

export const LOAD_CATEGORIES_FAILURE = 'LOAD_CATEGORIES_FAILURE'
export const loadCategoriesFailure = () => ({
	type: LOAD_CATEGORIES_FAILURE
})

export const CREATE_CATEGORY = 'CREATE_CATEGORY'
export const createCategory = category => ({
	type: CREATE_CATEGORY,
	payload: {category}
})

export const UPDATE_CATEGORY = 'UPDATE_CATEGORY'
export const updateCategory = category => ({
	type: UPDATE_CATEGORY,
	payload: {category}
})