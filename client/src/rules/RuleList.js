import React from 'react'
import {connect} from "react-redux"
import Rule from "./Rule"
import {allRules} from "./selectors"

const RuleList = ({ rules }) => {

	return (
		<div>
			{rules.map(rule => <Rule rule={rule}/>)}
		</div>
	)
}

const mapStateToProps = state => ({
	rules: allRules(state)
})

export default connect(
	mapStateToProps
)(RuleList)