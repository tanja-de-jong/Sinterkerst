// types of action
export const FETCH_ITEMS_BEGIN = "FETCH_ITEMS_BEGIN"
export const FETCH_ITEMS_SUCCESS = "FETCH_ITEMS_SUCCESS"
export const FETCH_ITEMS_FAILURE = "FETCH_ITEMS_FAILURE"
export const CREATE_ITEM = "CREATE_ITEM"
export const CREATE_ITEM_SUCCESS = "CREATE_ITEM_SUCCESS"
export const CREATE_ITEM_FAILURE = "CREATE_ITEM_FAILURE"
export const TOGGLE_CHECK = "TOGGLE_CHECK"
export const TOGGLE_CHECK_SUCCESS = "TOGGLE_CHECK_SUCCESS"
export const TOGGLE_CHECK_FAILURE = "TOGGLE_CHECK_FAILURE"

// actions
export const fetchItemsBegin = () => ({
	type: FETCH_ITEMS_BEGIN
});

export const fetchItemsSuccess = (items) => ({
	type: FETCH_ITEMS_SUCCESS,
	payload: { items }
});

export const fetchItemsFailure = error => ({
	type: FETCH_ITEMS_FAILURE,
	payload: { error }
});

export const createItemSuccess = (item, log) => ({
	type: CREATE_ITEM_SUCCESS,
	payload: { item, log }
});

export const createItemFailure = error => ({
	type: CREATE_ITEM_FAILURE,
	payload: { error }
});

export const toggleCheckSuccess = (item, log) => ({
	type: TOGGLE_CHECK_SUCCESS,
	payload: { item, log }
});

export const toggleCheckFailure = error => ({
	type: TOGGLE_CHECK_FAILURE,
	payload: { error }
});