import React, {useEffect, useState} from 'react'
import TransactionList from "./TransactionList"
import {applyRules, loadTransactions} from "./thunks"
import {connect} from "react-redux"
import {allTransactions} from "./selectors"
import CategorySelector from "./CategorySelector"
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import Dialog from "@material-ui/core/Dialog"
import ListItem from "@material-ui/core/ListItem"
import Button from "@material-ui/core/Button"

const TransactionOverview = ({ transactions = [], applyRules }) => {

	const [open, setOpen] = useState(false)

	return <div>
		<TransactionList />
		<Button onClick={() => setOpen(true)}>Nieuw</Button>
		<UploadModal open={open}/>
	</div>
	{/*<button onClick={applyRules}>Regels uitvoeren</button>*/}
}

const mapDispatchToProps = dispatch => ({
	applyRules: () => dispatch(applyRules())
})

export default connect(null, mapDispatchToProps)(withAuthenticationRequired(TransactionOverview, {
	onRedirecting: () => "Loading...",
}))

const UploadModal = (open) => {
	return <Dialog open={open}>
		Test
	</Dialog>
}