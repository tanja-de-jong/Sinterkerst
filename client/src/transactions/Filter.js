import React, {useState} from 'react'
import TextField from "@material-ui/core/TextField/TextField"
import Autocomplete from "@material-ui/lab/Autocomplete/Autocomplete"

const Filter = ({ options, label, selected, handleChange, group }) => {

	const props = {}
	if (group) {
		props.groupBy = option => option.group
	}

debugger
	return (
		<Autocomplete
			value={selected}
			options={options}
			getOptionLabel={option => option.name}
			renderInput={(params) => <TextField {...params} label={label} variant="outlined"/>}
			onChange={(event, newValue) => {
				handleChange(newValue.id)
			}}
			style={{ width: 300 }}
			{ ...props }
		/>
	)
}

export default Filter