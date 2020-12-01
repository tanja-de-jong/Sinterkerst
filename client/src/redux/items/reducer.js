import _ from "lodash"
import {
	CREATE_ITEM_FAILURE,
	CREATE_ITEM_SUCCESS,
	FETCH_ITEMS_BEGIN,
	FETCH_ITEMS_FAILURE,
	FETCH_ITEMS_SUCCESS, TOGGLE_CHECK_FAILURE, TOGGLE_CHECK_SUCCESS
} from "./action"

const defaultState = {
	items: [],
	loading: false,
	error: null
};

const itemsReducer = (state = defaultState, action) => {
	switch (action.type) {
		case FETCH_ITEMS_BEGIN: {
			return {
				...state,
				loading: true,
			}
		}

		case FETCH_ITEMS_SUCCESS: {
			return {
				...state,
				loading: false,
				items: action.payload.items,
			}
		}

		case FETCH_ITEMS_FAILURE: {
			return {
				...state,
				loading: false,
				error: action.payload.error,
				items: [],
			}
		}

		case CREATE_ITEM_SUCCESS: {
			let newState = _.cloneDeep(state);
			newState.items = [action.payload.item].concat(newState.items)
			return newState
		}

		case CREATE_ITEM_FAILURE: {
			return {
				...state,
				error: action.payload.error,
			}
		}

		case TOGGLE_CHECK_SUCCESS: {
			// CONFLICT
			if (action.payload.error) {
				alert("Iemand anders heeft dit item helaas net afgestreept!")
			}

			let newState = _.cloneDeep(state);
			newState.items = state.items.map(item => item.id === action.payload.item.id ? action.payload.item : item)

			return newState
		}

		case TOGGLE_CHECK_FAILURE: {
			return {
				...state,
				error: action.payload.error,
			}
		}

		default:
			return state;
	}
};

export default itemsReducer;