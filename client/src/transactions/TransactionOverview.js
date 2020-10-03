import React, {useEffect, useState} from 'react'
import TransactionList from "./TransactionList"
import {applyRules, loadTransactions} from "./thunks"
import {connect} from "react-redux"
import {allTransactions} from "./selectors"
import CategorySelector from "./CategorySelector"
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";

const TransactionOverview = ({ transactions = [], applyRules }) => {

	return <TransactionList />
	{/*<button onClick={applyRules}>Regels uitvoeren</button>*/}
}

const mapDispatchToProps = dispatch => ({
	applyRules: () => dispatch(applyRules())
})

export default connect(null, mapDispatchToProps)(withAuthenticationRequired(TransactionOverview, {
	onRedirecting: () => "Loading...",
}))