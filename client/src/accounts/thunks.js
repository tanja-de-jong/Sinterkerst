import {
	loadAccountsFailure, loadAccountsInProgress, loadAccountsSuccess,
} from "./actions"
import {apiFetch} from "../helper"

export const loadAccounts = () => async (dispatch) => {
	try {
		dispatch(loadAccountsInProgress())
		const response = await apiFetch('/api/accounts')
		const accounts = await response.json()
		dispatch(loadAccountsSuccess(accounts))
	} catch (e) {
		dispatch(loadAccountsFailure())
		dispatch(displayAlert(e))
	}
}

export const displayAlert = (text) => () => {
	alert(text)
}