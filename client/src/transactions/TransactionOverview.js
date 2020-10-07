import React from 'react'
import TransactionList from "./TransactionList"
import {applyRules} from "./thunks"
import {connect} from "react-redux"

const TransactionOverview = ({ applyRules }) => {

	return <div>
		<button onClick={applyRules}>Regels uitvoeren</button>
		<TransactionList />
	</div>
}

const mapDispatchToProps = dispatch => ({
	applyRules: () => dispatch(applyRules()),
})
export default connect(null, mapDispatchToProps)(TransactionOverview)