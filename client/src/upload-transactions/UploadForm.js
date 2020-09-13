import React, {useState} from 'react'
import {connect} from "react-redux"
import TransactionList from "../transactions/TransactionList"
import {Link} from "react-router-dom"
import {newTransactions} from "../transactions/selectors"
import {uploadFile} from "../transactions/thunks"
import {clearNewTransactions} from "../transactions/actions"

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

	return content
}

const mapStateToProps = state => ({
	newTransactions: newTransactions(state)
})


const mapDispatchToProps = dispatch => ({
	uploadFile: file => dispatch(uploadFile(file)),
	clearNewTransactions: () => dispatch(clearNewTransactions()),
})

export default connect(mapStateToProps, mapDispatchToProps)(UploadForm)