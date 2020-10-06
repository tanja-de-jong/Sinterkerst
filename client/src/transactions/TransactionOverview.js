import React, {useEffect, useState} from 'react'
import TransactionList from "./TransactionList"
import {applyRules} from "./thunks"
import {connect} from "react-redux"
import { withAuthenticationRequired } from "@auth0/auth0-react";
import Dialog from "@material-ui/core/Dialog"
import Button from "@material-ui/core/Button"
import {loadCategories} from "../categories/thunks"
import {loadRules} from "../rules/thunks"
import {categoriesLoading} from "../categories/selectors"
import {rulesLoading} from "../rules/selectors"

const TransactionOverview = () => {

	return <div>
		<TransactionList />
	</div>
	{/*<button onClick={applyRules}>Regels uitvoeren</button>*/}
}
export default TransactionOverview