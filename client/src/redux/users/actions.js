// types of action
export const FETCH_USERS_BEGIN = "FETCH_USERS_BEGIN"
export const FETCH_USERS_SUCCESS = "FETCH_USERS_SUCCESS"
export const FETCH_USERS_FAILURE = "FETCH_USERS_FAILURE"
export const SELECT_USER = "SELECT_USER"

// actions
export const fetchUsersBegin = () => ({
	type: FETCH_USERS_BEGIN
})

export const fetchUsersSuccess = users => ({
	type: FETCH_USERS_SUCCESS,
	payload: { users }
})

export const fetchUsersFailure = error => ({
	type: FETCH_USERS_FAILURE,
	payload: { error }
})

export const selectUser = user => ({
	type: SELECT_USER,
	payload: user
})