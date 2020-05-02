const Cart = require('../../../db/models/Cart')
const clearCartOfArchivedTutorialsAndBundles = require('../../utils/clearCartOfArchivedTutorialsAndBundles')

module.exports = async (req, res) => {
	try {
		const userCart = await Cart.query()
			.findOne({ user_id: req.user.id })
			.eager('[bundles.[tutorials], tutorials]')
			.modifyEager('tutorials', (builder) =>
				builder.select(
					'tutorials.id',
					'tutorials.name',
					'tutorials.description',
					'tutorials.price',
					'tutorials.archived'
				)
			)
			.modifyEager('bundles', (builder) =>
				builder.select(
					'tutorial_bundles.id',
					'tutorial_bundles.name',
					'tutorial_bundles.description',
					'tutorial_bundles.price',
					'tutorial_bundles.archived'
				)
			)
			.modifyEager('bundles.[tutorials]', (builder) =>
				builder.select(
					'tutorials.id',
					'tutorials.name',
					'tutorials.description',
					'tutorials.price',
					'tutorials.archived'
				)
			)

		// Check if there are archived tutorials or bundles in cart and remove them from cart if that's true.
		const archivedProducts = await clearCartOfArchivedTutorialsAndBundles(
			userCart
		)

		const { tutorials, bundles } = userCart
		let returningProducts = { tutorials, bundles }

		let msg = null
		if (archivedProducts) {
			msg = `Archived products found in cart. Cart updated!`
			if (archivedProducts.tutorials && archivedProducts.tutorials.length > 0) {
				returningProducts.tutorials = returningProducts.tutorials.filter((t) =>
					archivedProducts.tutorials.some((aT) => aT.id !== t.id) // check .includes
				)
			}
			if (archivedProducts.bundles && archivedProducts.bundles.length > 0) {
				returningProducts.bundles = returningProducts.bundles.filter((b) =>
					archivedProducts.bundles.some((aB) => aB.id !== b.id) // check .includes
				)
			}
		}

		res.json({ products: returningProducts, msg })
	} catch (err) {
		console.error(err)
		res.status(500).json({ msg: 'Server error' })
	}
}
