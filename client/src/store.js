import { createStore, combineReducers, applyMiddleware } from 'redux'
import { persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2"
import thunk from 'redux-thunk'
import {uploadTransactions} from "./upload-transactions/reducers"
import {composeWithDevTools} from "redux-devtools-extension"
import {transactions} from "./show-transactions/reducers"
import {categories} from "./category-settings/reducers"

const reducers = {
	newTransactions: uploadTransactions,
	transactions: transactions,
	categories: categories,
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