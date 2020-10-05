import {
	loadAccountsFailure, loadAccountsInProgress, loadAccountsSuccess,
} from "./actions"


export const loadAccounts = () => async (dispatch) => {
	try {
		dispatch(loadAccountsInProgress())
		const response = await fetch('/api/accounts')
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