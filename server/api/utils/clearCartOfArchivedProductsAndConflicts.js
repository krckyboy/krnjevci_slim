const clearCartOfArchivedTutorialsAndBundles = require('./clearCartOfArchivedTutorials')
const removeTutorialsInConflictWithinCart = require('./removeTutorialsInConflictWithinCart')

module.exports = async function clearCartOfArchivedProductsAndConflicts(
	userCart
) {
	const archivedProducts = await clearCartOfArchivedTutorialsAndBundles(
		userCart
	)

	const conflictedProducts = await removeTutorialsInConflictWithinCart({ userCart })

	if (archivedProducts || conflictedProducts) {
		return `Archived products or conflicted products found! Cart updated!`
	} else {
		return null
	}
}
