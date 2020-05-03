// Check if there are archived products in cart and remove if there are. Function returns an object containing archived tutorials.

module.exports = async function clearCartOfArchivedTutorials(userCart) {
	// Check if any tutorials are archived, clear them from cart and return the archived tuts
	const { tutorials } = userCart

	// Fetch the archived tutorials
	let archivedTutorials = []
	tutorials.forEach((t) => {
		if (t.archived) archivedTutorials.push(t)
	})

	const archivedProducts = {
		tutorials: archivedTutorials,
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

	if (archivedProducts.tutorials.length > 0) {
		return `Korpa je osvežena! Arhivirani artikli su uklonjeni!`
	}

	return null
}
