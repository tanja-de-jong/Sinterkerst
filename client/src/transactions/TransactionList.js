import React, {useEffect, useState} from 'react'
import Transaction from "./Transaction"
import Pagination from '@material-ui/lab/Pagination';
import {getPagesRequest, loadTransactions} from "./thunks"
import {connect} from "react-redux"
import {pages} from "./selectors"
import CategorySelector from "./CategorySelector"

const TransactionList = ({ transactions = [], pages, getPages, startLoadingTransactions }) => {

	useEffect(() => {
		getPages(category)
	}, [getPages])

	const [page, setPage] = React.useState(1)
	const handleChange = (event, value) => {
		setPage(value);
		startLoadingTransactions(value, category)
	}
	const [category, setCategory] = useState()//useState("22ofrnfYO")

	const content = transactions.map(transaction => <Transaction key={transaction.id} transaction={transaction} />)

	const handleCategorySelection = (value) => {
		setCategory(value)
		getPages(value)
		startLoadingTransactions(page, value)
	}

	return (
		<div>
			<CategorySelector selected={category} onSelect={handleCategorySelection}/>
			<Pagination count={pages} page={page} onChange={handleChange} />
			Aantal transacties: {transactions.length}
			{content}
		</div>
	)
}

const mapStateToProps = state => ({
	pages: pages(state)
})

const mapDispatchToProps = dispatch => ({
	startLoadingTransactions: (page, category) => dispatch(loadTransactions(page, category)),
	getPages: (category) => dispatch(getPagesRequest(category)),
})

export default connect(mapStateToProps, mapDispatchToProps)(TransactionList)