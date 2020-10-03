import React from 'react'
import Category from "./Category"
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import TreeView from "@material-ui/lab/TreeView"

const CategoryList = ({ categories, topLevel }) => {
	const topCategories = categories.filter(category => category.parent === topLevel.id)

	const renderCategoryWithChildren = (parent, level) => {
		const children = categories.filter(category => category.parent === parent.id)
		const childItems = children.map(child => renderCategoryWithChildren(child))

		return <Category key={parent.id} category={parent} categories={categories} children={childItems}/>
	}

	return (
		<TreeView
			defaultCollapseIcon={<ExpandMoreIcon />}
			defaultExpandIcon={<ChevronRightIcon />}>
			{topCategories.map(topCategory => renderCategoryWithChildren(topCategory, ""))}
		</TreeView>
	)
}

export default CategoryList