// Check if there's a conflict in cart, if there is a tutorial in cart that's within a bundle that's also in cart. If conflictedTutorials, remove those from cart and return them as return value.

// @todo Fix this function
module.exports = async function removeTutorialsInConflictWithinCart({
	userCart,
}) {
	const { bundles, tutorials } = userCart

	if (bundles.length > 0) {
		const tutorialIdsInBundle = []
		bundles.forEach((b) => {
			const tIds = b.tutorials.map((t) => t.id)
			tIds.forEach((id) => {
				if (!tutorialIdsInBundle.includes(id)) {
					tutorialIdsInBundle.push(id)
				}
			})
		})

		const conflictedTutorials = []
		tutorials.forEach((t) => {
			tutorialIdsInBundle.forEach((tB) => {
				if (tB === t.id) {
					conflictedTutorials.push(t)
				}
			})
		})

		if (conflictedTutorials.length > 0) {
			// Remove conflicted tutorials from cart
			await userCart
				.$relatedQuery('tutorials')
				.unrelate()
				.whereIn(
					'tutorial_id',
					conflictedTutorials.map((t) => t.id)
				)

			return conflictedTutorials
		}
	}
	return null
}

// tutorial,
// bundle,

// if (typeof tutorialId !== 'undefined') {
// 	tutorialIdsInBundle.forEach((tB) => {
// 		if (tB === tutorial.id) {
// 			conflictedTutorials.push(tutorial)
// 		}
// 	})
// }

// if (typeof bundle !== 'undefined') {
// 	const tutorialIdsInBundleParam = bundle.tutorials.map((t) => t.id)
// 	tutorials.forEach((t) => {
// 		tutorialIdsInBundleParam.forEach((tB) => {
// 			if (tB === t.id) {
// 				conflictedTutorials.push(t)
// 			}
// 		})
// 	})
// }
