import { createStore, combineReducers, applyMiddleware } from 'redux'
import { persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2"
import thunk from 'redux-thunk'
import {composeWithDevTools} from "redux-devtools-extension"
import {transactions} from "./transactions/reducers"
import {categories} from "./categories/reducers"
import {rules} from "./rules/reducers"
import {accounts} from "./accounts/reducers"

const reducers = {
	transactions: transactions,
	categories: categories,
	rules: rules,
	accounts: accounts,
}

const persistConfig = {
	key: 'root',
	storage,
	stateReconciler: autoMergeLevel2
}

const rootReducer = combineReducers(reducers)
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const configureStore = () => createStore(
	persistedReducer,
	composeWithDevTools(
		applyMiddleware(thunk)
	)
)