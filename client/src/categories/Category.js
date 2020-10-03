import React, {useState} from 'react'
import AddOrUpdateCategory from "./AddOrUpdateCategory"
import EditIcon from '@material-ui/icons/Edit'
import TreeItem from "@material-ui/lab/TreeItem"
import Modal from "@material-ui/core/Modal"
import makeStyles from "@material-ui/core/styles/makeStyles"

function getModalStyle() {
	const top = 50;
	const left = 50;

	return {
		top: `${top}%`,
		left: `${left}%`,
		transform: `translate(-${top}%, -${left}%)`,
	};
}

const useStyles = makeStyles((theme) => ({
	paper: {
		position: 'absolute',
		width: 400,
		backgroundColor: theme.palette.background.paper,
		border: '2px solid #000',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
	},
}));

const Category = ({ category, categories, children }) => {
	const classes = useStyles();
	// getModalStyle is not a pure function, we roll the style only on the first render
	const [modalStyle] = React.useState(getModalStyle);

	 const [edit, setEdit] = useState(false)

	let label = <div>
		{category.name} ({category.id})
		<EditIcon onClick={() => setEdit(true)}/>
	</div>

	return <div>
		<TreeItem nodeId={category.id.toString()} label={label}>
			{children}
		</TreeItem>

		<Modal open={edit} onClose={() => setEdit(false)}>
			<div style={modalStyle} className={classes.paper}>
				<AddOrUpdateCategory category={category} categories={categories} />
			</div>
		</Modal>
	</div>
}

export default Category