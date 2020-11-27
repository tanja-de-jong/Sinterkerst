import {FETCH_USERS_BEGIN, FETCH_USERS_FAILURE, FETCH_USERS_SUCCESS, SELECT_USER} from "./actions"
import _ from "lodash"
import {UPDATE_LOG_SUCCESS} from "../logs/action"

const defaultState = {
	users: [],
	loading: false,
	error: null,
	currentUser: -1
};

const usersReducer = (state = defaultState, action) => {
	switch (action.type) {
		case FETCH_USERS_BEGIN: {
			return {
				...state,
				loading: true,
			}
		}

		case FETCH_USERS_SUCCESS: {
			return {
				...state,
				loading: false,
				users: action.payload.users,
			}
		}

		case FETCH_USERS_FAILURE: {
			return {
				...state,
				loading: false,
				error: action.payload.error,
				users: [],
			}
		}

		case SELECT_USER: {
			let user = action.payload;
			let newState = _.cloneDeep(state);
			newState.currentUser = user
			return newState;
		}

		case UPDATE_LOG_SUCCESS: {
			return {
				...state,
				users: state.users.map(user =>  user.id === action.payload.user.id ? action.payload.user : user)
			}
		}

		default:
			return state;
	}
};

export default usersReducer;