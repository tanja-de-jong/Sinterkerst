import React, {useState} from 'react'
import {connect} from "react-redux"
import {uploadFile} from "../transactions/thunks"
import Dialog from "@material-ui/core/Dialog/Dialog"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"

const UploadModal = ({ open, setOpen, uploadFile }) => {
	const [file, setFile] = useState()

	return <Dialog open={open} onClose={() => setOpen(false)}>
		<div>
			<TextField name="upload-csv" type="file" onChange={e => setFile(e.target.files[0])}/>
			<Button variant="contained" disabled={!file} onClick={() => {
				uploadFile(file)
				setOpen(false)
			}}>Verwerk</Button>
		</div>
	</Dialog>
}

const mapDispatchToProps = dispatch => ({
	uploadFile: file => dispatch(uploadFile(file)),
})

export default connect(null, mapDispatchToProps)(UploadModal)

// const UploadForm = ({ uploadFile, newTransactions, clearNewTransactions }) => {
//
//
//
// 	const content = newTransactions && newTransactions.length
// 		? (
// 				<div>
// 					<TransactionList transactions={newTransactions} />
// 					<button onClick={clearNewTransactions}><Link to={"/"}>Ga verder</Link></button>
// 				</div>
// 			)
// 		: (
// 				<div>
// 					<form onSubmit={handleSubmit}>
// 						<h1>Upload CSV</h1>
// 						<input type="file" onChange={e => setFile(e.target.files[0])} />
// 						<button type="submit">Upload</button>
// 					</form>
// 				</div>
// 			)
//
// 	return content
// }
//
// const mapStateToProps = state => ({
// 	newTransactions: newTransactions(state)
// })
//
//
// const mapDispatchToProps = dispatch => ({
// 	uploadFile: file => dispatch(uploadFile(file)),
// 	clearNewTransactions: () => dispatch(clearNewTransactions()),
// })
//
// export default connect(mapStateToProps, mapDispatchToProps)(withAuthenticationRequired(UploadForm, {
// 	onRedirecting: () => "Loading...",
// }))