import _ from "lodash"
import {FETCH_LOGS_BEGIN, FETCH_LOGS_FAILURE, FETCH_LOGS_SUCCESS, Types} from "./action"
import {CREATE_ITEM_SUCCESS, TOGGLE_CHECK_FAILURE, TOGGLE_CHECK_SUCCESS} from "../items/action"

const defaultState = {
	logs: [],
	loading: false
};

const logsReducer = (state = defaultState, action) => {
	switch (action.type) {
		case FETCH_LOGS_BEGIN: {
			return {
				...state,
				loading: true,
			}
		}

		case FETCH_LOGS_SUCCESS: {
			return {
				...state,
				logs: action.payload.logs,
			}
		}

		case CREATE_ITEM_SUCCESS: {
			let newState = _.cloneDeep(state);
			newState.logs.push(action.payload.log)
			return newState;
		}

		case TOGGLE_CHECK_SUCCESS: {
			// CONFLICT
			if (action.payload.error) {
				alert("Iemand anders heeft dit item helaas net afgestreept!")
			}

			let newState = _.cloneDeep(state);
			newState.logs.push(action.payload.log)

			return newState;
		}

		case TOGGLE_CHECK_FAILURE: {
			return {
				...state,
				loading: false,
				error: action.payload.error,
				users: [],
				lists: []
			}
		}

		default:
			return state;
	}
};

export default logsReducer;