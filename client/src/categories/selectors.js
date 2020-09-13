import { createSelector } from 'reselect'

export const allCategories = (state) => {
	return state.categories.data
}

export const categoriesLoading = state => {
	return state.categories.isLoading
}

export const categoriesByTopLevel = createSelector(
	allCategories,
	categories => {
		const topLevels = categories.filter(category => category.parent === null)
		return topLevels.map(level => {
			return {
				"category": level,
				"children": getDescendantCategories(level.id, categories)
			}
		})
	}
)

export const incomeCategories = createSelector(
	allCategories,
	categories => getDescendantCategories(61, categories)
)

export const expensesCategories = createSelector(
	allCategories,
	categories => getDescendantCategories(4, categories)
)

export const savingsCategories = createSelector(
	allCategories,
	categories => getDescendantCategories(70, categories)
)

const getDescendantCategories = (parent, categories) => {
	const children = categories.filter(category => category.parent === parent)
	const descendants = children.flatMap(child => getDescendantCategories(child.id, categories))
	return children.concat(descendants)
}