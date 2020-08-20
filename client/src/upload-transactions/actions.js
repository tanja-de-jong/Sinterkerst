export const CREATE_ITEM = 'CREATE_ITEM'
export const createItem = item => ({
	type: CREATE_ITEM,
	payload: {item}
})

export const UPDATE_ITEM = 'UPDATE_ITEM'
export const updateItem = item => ({
	type: UPDATE_ITEM,
	payload: {item}
})

export const REMOVE_ITEM = 'REMOVE_ITEM'
export const removeItem = item => ({
	type: REMOVE_ITEM,
	payload: {item}
})

export const LOAD_ITEMS_IN_PROGRESS = 'LOAD_ITEMS_IN_PROGRESS'
export const loadItemsInProgress = () => ({
	type: LOAD_ITEMS_IN_PROGRESS
})

export const LOAD_ITEMS_SUCCESS = 'LOAD_ITEMS_SUCCESS'
export const loadItemsSuccess = inventory => ({
	type: LOAD_ITEMS_SUCCESS,
	payload: {inventory}
})

export const LOAD_ITEMS_FAILURE = 'LOAD_ITEMS_FAILURE'
export const loadItemsFailure = () => ({
	type: LOAD_ITEMS_FAILURE
})