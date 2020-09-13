import React from 'react'
import CategorySettings from "./categories/CategorySettings"
import RulesSettings from "./rules/RulesSettings"
import {withAuthenticationRequired} from "@auth0/auth0-react"

const Settings = () => {
	return (
		<div>
			<CategorySettings/>
			<RulesSettings/>
		</div>
	)
}

export default withAuthenticationRequired(Settings, {
	onRedirecting: () => "Loading...",
})