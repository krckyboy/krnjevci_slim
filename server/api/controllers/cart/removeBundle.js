const TutorialBundle = require('../../../db/models/TutorialBundle')
const Cart = require('../../../db/models/Cart')

module.exports = async (req, res) => {
	try {
		const paramsId = parseInt(req.params.id)
		const bundle = await TutorialBundle.query()
			.findOne({ id: paramsId })
			.select('id', 'name', 'description', 'price')

		if (!bundle) {
			return res.status(404).json({ msg: `bundle doesn't exist!` })
		}

		const userCart = await Cart.query()
			.findOne({ user_id: req.user.id })
			.eager('[bundles.[tutorials], tutorials]')

		const { bundles: bundlesInCart } = userCart

		// Check if user has that bundle in cart
		const bundleAlreadyAdded = bundlesInCart.some((t) => t.id === paramsId)

		if (!bundleAlreadyAdded) {
			return res
				.status(404)
				.json({ msg: `You don't have that bundle in cart!` })
		}

		await userCart
			.$relatedQuery('bundles')
			.unrelate()
			.where({ bundle_id: bundle.id })

		res.json({ bundle })
	} catch (err) {
		console.error(err)
		res.status(500).json({ msg: 'Server error' })
	}
}
