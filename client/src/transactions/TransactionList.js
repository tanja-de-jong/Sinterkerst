import React, {useEffect, useState} from 'react'
import {getRowsRequest, loadTransactions} from "./thunks"
import {connect} from "react-redux"
import {allTransactions, pages} from "./selectors"
import CategorySelector from "./CategorySelector"
import {DataGrid} from "@material-ui/data-grid"
import moment from "moment"
import {allAccounts} from "../accounts/selectors"
import {loadAccounts} from "../accounts/thunks"
import styled from 'styled-components'
import Filter from "./Filter"
import {allCategories} from "../categories/selectors"
import {loadCategories} from "../categories/thunks"

const TransactionList = ({ transactions = [], accounts = [], categories = [], getRows, startLoadingAccounts, startLoadingTransactions, startLoadingCategories }) => {
	const [category, setCategory] = useState()
	const [page, setPage] = React.useState(1)
	const [numberOfRows, setNumberOfRows] = React.useState()
	const [pageSize, setPageSize] = React.useState(15)
	const [selectedAccount, setSelectedAccount] = useState()

	useEffect(() => {
		startLoadingTransactions(page, category, pageSize, selectedAccount)
		startLoadingAccounts()
	}, [])

	useEffect(() => {
		getRows(category, pageSize).then(rowCount => setNumberOfRows(rowCount))
		startLoadingTransactions(page, category, pageSize, selectedAccount)
	}, [category, selectedAccount])

	const handlePageChange = (page) => {
		setPage(page);
		startLoadingTransactions(page, category, pageSize)
	}

	const columns = [
		{ field: 'id', headerName: 'ID', width: 100, hide: true},
		{ field: 'category', headerName: 'Categorie', width: 200},
	  { field: 'account', headerName: 'Account', width: 100 },
	  { field: 'description', headerName: 'Omschrijving', width: 300 },
	  { field: 'date', headerName: 'Datum', width: 200 },
	  { field: 'amount', headerName: 'Bedrag', width: 100 },
	  { field: 'remarks', headerName: 'Opmerkingen', width: 1000 },
	]

	const rows = transactions.map(transaction => {
		const account = accounts.find(account => account.id === transaction.account).name
		const category = categories.find(category => category.id === transaction.category).name

		return {
			id: transaction.id,
			category: category,
			account: account,
			description: transaction.description,
			date: moment(transaction.date, "YYYYMMDD").locale("nl").format("DD MMMM YYYY"),
			amount: "€ " + transaction.amount.toFixed(2).replace(".", ","),
			remarks: transaction.remarks
		}
	})

	const FilterDiv = styled.div`
		display: flex;
	`

	return (
		<div style={{ height: 900, width: '100%' }}>
			<FilterDiv> {/* Filters */}
				<CategorySelector onSelect={setCategory} />
				<Filter label="Account" options={accounts} handleChange={setSelectedAccount} group={false} />
			</FilterDiv>
			<DataGrid rows={rows} columns={columns} page={page} onPageChange={params => handlePageChange(params.page)} pagination rowCount={numberOfRows} rowsPerPageOptions={[15, 25, 50]} pageSize={pageSize} onPageSizeChange={(size) => setPageSize(size)} paginationMode="server" zIndex={10} />
		</div>
	)
}

const mapStateToProps = state => ({
	pages: pages(state),
	transactions: allTransactions(state),
	categories: allCategories(state),
	accounts: allAccounts(state)
})

const mapDispatchToProps = dispatch => ({
	startLoadingTransactions: (page, category, limit, account) => dispatch(loadTransactions(page, category, limit, account)),
	getRows: (category) => dispatch(getRowsRequest(category)),
	startLoadingAccounts: () => dispatch(loadAccounts()),
	startLoadingCategories: () => dispatch(loadCategories()),
})

export default connect(mapStateToProps, mapDispatchToProps)(TransactionList)