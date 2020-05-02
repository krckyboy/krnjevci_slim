// Check if there are archived products in cart and remove if there are. Function returns an object containing archived tutorials and bundles.

module.exports = async function clearCartOfArchivedTutorialsAndBundles(
	userCart
) {
	// Check if any tutorials or bundles are archived, clear them from cart and return the archived tuts
	const { bundles, tutorials } = userCart

	// Fetch the archived tutorials
	let archivedTutorials = []
	tutorials.forEach((t) => {
		if (t.archived) archivedTutorials.push(t)
	})

	// Fetch the archived bundles
	let archivedBundles = []
	bundles.forEach((b) => {
		if (b.archived) archivedBundles.push(b)
	})

	const archivedProducts = {
		tutorials: archivedTutorials,
		bundles: archivedBundles,
	}

	if (archivedTutorials.length > 0) {
		await userCart
			.$relatedQuery('tutorials')
			.unrelate()
			.whereIn(
				'tutorial_id',
				archivedTutorials.map((t) => t.id)
			)
	}

	if (archivedBundles.length > 0) {
		// Update cart, clearing archived bundles
		await userCart
			.$relatedQuery('bundles')
			.unrelate()
			.whereIn(
				'bundle_id',
				archivedBundles.map((b) => b.id)
			)
	}

	if (archivedProducts.tutorials.length > 0 || archivedBundles.length > 0) {
		return archivedProducts
	}

	return null
}
