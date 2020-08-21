import React, {useState} from 'react'
import {uploadFile} from "./thunks"
import {connect} from "react-redux"
import TransactionList from "../show-transactions/TransactionList"
import {clearNewTransactions} from "./actions"
import {Link} from "react-router-dom"

const UploadForm = ({ uploadFile, newTransactions, clearNewTransactions }) => {

	const [file, setFile] = useState()

	const handleSubmit = (event) => {
		event.preventDefault()
		uploadFile(file)
	}

	const content = newTransactions && newTransactions.length
		? (
				<div>
					<TransactionList transactions={newTransactions} />
					<button onClick={clearNewTransactions}><Link to={"/"}>Ga verder</Link></button>
				</div>
			)
		: (
				<div>
					<form onSubmit={handleSubmit}>
						<h1>Upload CSV</h1>
						<input type="file" onChange={e => setFile(e.target.files[0])} />
						<button type="submit">Upload</button>
					</form>
				</div>
			)

debugger
	return content
}

const mapStateToProps = state => ({
	newTransactions: state.newTransactions
})


const mapDispatchToProps = dispatch => ({
	uploadFile: file => dispatch(uploadFile(file)),
	clearNewTransactions: () => dispatch(clearNewTransactions()),
})

export default connect(mapStateToProps, mapDispatchToProps)(UploadForm)