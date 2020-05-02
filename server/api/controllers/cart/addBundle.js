const TutorialBundle = require('../../../db/models/TutorialBundle')
const Cart = require('../../../db/models/Cart')
const clearCartOfArchivedTutorialsAndBundles = require('../../utils/clearCartOfArchivedTutorialsAndBundles')

module.exports = async (req, res) => {
	try {
		const paramsId = parseInt(req.params.id)
		const bundle = await TutorialBundle.query()
			.findOne({ id: paramsId })
			.eager('tutorials')
			.select('id', 'name', 'description', 'price', 'archived')

		if (!bundle || bundle.archived) {
			return res.status(404).json({ msg: `Bundle doesn't exist!` })
		}

		// Check if user has already bought that bundle
		const bundleBought = await TutorialBundle.query()
			.joinRelation('users')
			.findOne('bundle_id', paramsId)
			.andWhere('user_id', req.user.id)

		if (bundleBought) {
			// Send the message to user about which t/b are removed from cart due to them being archived
			return res.status(400).json({
				msg: `Purchase failed - you've already bought this bundle!`,
			})
		}

		const userCart = await Cart.query()
			.findOne({ user_id: req.user.id })
			.eager('[bundles.[tutorials], tutorials]')

		// Check if there are archived tutorials or bundles in cart and remove them from cart if that's true.
		const archivedProductNames = await clearCartOfArchivedTutorialsAndBundles(
			userCart
		)

		let msg = null
		if (archivedProductNames) {
			msg = `Archived products found in cart. Cart updated!`
		}

		// Check if user already has that bundle in cart
		const { bundles: bundlesInCart } = userCart
		const bundleAlreadyAdded = bundlesInCart.some((t) => t.id === paramsId)

		if (bundleAlreadyAdded) {
			return res
				.status(400)
				.json({ msg: 'That bundle has already been added to the cart!' })
		}

		await userCart.$relatedQuery('bundles').relate(bundle) // or .relate({id: bundle.id})

		res.json({ bundle, msg })
	} catch (err) {
		console.error(err)
		res.status(500).json({ msg: 'Server error' })
	}
}
