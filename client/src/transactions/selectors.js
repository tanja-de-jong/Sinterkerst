export const allTransactions = (state) => {
	return state.transactions.data
}

export const newTransactions = (state) => {
	return state.transactions.new
}

export const transactionsLoading = state => {
	return state.transactions.isLoading
}

export const pages = state => {
	return state.transactions.pages
}

export const amounts = state => {
	return state.transactions.amounts
}


