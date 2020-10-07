import React, {useEffect} from 'react'
import {connect} from "react-redux"
import Rule from "./Rule"
import {allRules} from "./selectors"
import {loadRules} from "../rules/thunks"

const RuleList = ({ rules, startLoadingRules }) => {

	useEffect(() => {
		startLoadingRules()
	}, [])

	return (
		<div>
			{rules.map(rule => <Rule rule={rule}/>)}
		</div>
	)
}

const mapStateToProps = state => ({
	rules: allRules(state)
})

const mapDispatchToProps = dispatch => ({
	startLoadingRules: () => dispatch(loadRules())
})

export default connect(
	mapStateToProps, mapDispatchToProps
)(RuleList)