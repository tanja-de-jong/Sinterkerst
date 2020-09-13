import React from 'react'
import {loadTransactions} from "./thunks"
import {connect} from "react-redux"
import {allTransactions, transactionsLoading} from "./selectors"
import {useAuth0} from "@auth0/auth0-react"

const Dashboard = () => {

	return (
		<LoginButton/>
	)
}

export default Dashboard

const LoginButton = () => {
	const { loginWithRedirect } = useAuth0();

	return <button onClick={() => loginWithRedirect()}>Log In</button>;
};