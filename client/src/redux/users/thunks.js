import {fetchUsersBegin, fetchUsersFailure, fetchUsersSuccess} from "./actions"

export const fetchUsers = () => async dispatch => {
	dispatch(fetchUsersBegin())
	const response = await fetch(`api/users`)
	const users = await response.json()
	dispatch(fetchUsersSuccess(users))
}