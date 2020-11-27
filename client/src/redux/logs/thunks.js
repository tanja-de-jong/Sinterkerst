import {fetchLogsBegin, fetchLogsSuccess, updateLogSuccess} from "./action"

export const fetchLogs = () => async dispatch => {
	dispatch(fetchLogsBegin())
	const response = await fetch(`api/logs`)
	const logs = await response.json()
	dispatch(fetchLogsSuccess(logs))
}


export const updateLog = (userId) => async (dispatch) => {
	const body = JSON.stringify({ userId })
	const response = await fetch(`api/update_log`, {
		method: 'POST',
		body,
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
	})
	const user = await response.json()
	dispatch(updateLogSuccess(user));
}