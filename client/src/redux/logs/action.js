// types of action
export const FETCH_LOGS_BEGIN = "FETCH_LOGS_BEGIN"
export const FETCH_LOGS_SUCCESS = "FETCH_LOGS_SUCCESS"
export const UPDATE_LOG_SUCCESS = "UPDATE_LOG_SUCCESS"

// actions
export const fetchLogsBegin = () => ({
	type: FETCH_LOGS_BEGIN
});

export const fetchLogsSuccess = (logs) => ({
	type: FETCH_LOGS_SUCCESS,
	payload: { logs }
});

export const updateLogSuccess = (user) => ({
	type: UPDATE_LOG_SUCCESS,
	payload: { user }
});